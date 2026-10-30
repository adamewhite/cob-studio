import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "../../../lib/stripe";
import {
  getResend,
  SALE_FROM_EMAIL,
  getSaleNotificationEmail,
} from "../../../lib/resend";
import { getArtwork, getThumbnail } from "../../../lib/artwork";
import {
  orderConfirmationHtml,
  orderConfirmationText,
} from "../../../lib/orderEmail";
import { absoluteUrl } from "../../../lib/site";
import { getPaidSlugs } from "../../../lib/sold";

export const runtime = "nodejs";

// In-memory dedupe for Stripe webhook retries. Fluid Compute reuses instances
// across requests, so this catches the common burst-retry case at zero cost.
// A cold start can re-fire an email, but that's far better than the previous
// behavior where any Resend error caused unbounded retries.
const processedEventIds = new Set<string>();
const PROCESSED_LIMIT = 500;

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Invalid signature: ${message}` },
      { status: 400 },
    );
  }

  if (processedEventIds.has(event.id)) {
    return NextResponse.json({ received: true, deduped: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
      limit: 100,
    });

    const items = lineItems.data.map((li) => {
      const product =
        typeof li.price?.product === "object" && li.price.product
          ? (li.price.product as Stripe.Product)
          : null;
      return {
        name: li.description ?? product?.name ?? "Unknown",
        slug: product?.metadata?.slug ?? "",
        amount: li.amount_total,
        currency: li.currency,
      };
    });

    // Whole-dollar amounts drop the cents, matching prices on the site.
    const formatAmount = (cents: number, currency: string) => {
      const digits = cents % 100 === 0 ? 0 : 2;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(cents / 100);
    };

    const customer = session.customer_details;
    const shipping = session.collected_information?.shipping_details;

    const lines = items
      .map(
        (i) =>
          `  • ${i.name} (slug: ${i.slug}) — ${formatAmount(
            i.amount ?? 0,
            i.currency ?? "usd",
          )}`,
      )
      .join("\n");

    const total = formatAmount(
      session.amount_total ?? 0,
      session.currency ?? "usd",
    );

    const shipToLines = shipping?.address
      ? [
          shipping.name,
          shipping.address.line1,
          shipping.address.line2,
          `${shipping.address.city ?? ""}, ${shipping.address.state ?? ""} ${shipping.address.postal_code ?? ""}`,
          shipping.address.country,
        ].filter((line): line is string => Boolean(line))
      : ["(no shipping address)"];
    const shipTo = shipToLines.join("\n");

    // Two buyers can race through checkout for the same one-of-one before
    // either payment lands. Catch it here so the later buyer can be refunded
    // before anything ships.
    let doubleSold: string[] = [];
    try {
      const paidElsewhere = await getPaidSlugs({ excludeSessionId: session.id });
      doubleSold = items
        .map((i) => i.slug)
        .filter((slug) => slug && paidElsewhere.has(slug));
    } catch (err) {
      console.error("Double-sale check failed", {
        sessionId: session.id,
        error: err instanceof Error ? err.message : err,
      });
    }

    const doubleSaleNote = doubleSold.length
      ? `DOUBLE SALE: ${doubleSold.join(", ")} was already paid for in another order. Refund this order in Stripe and email the customer. They were NOT sent an order confirmation.

`
      : "";

    const text = `${doubleSaleNote}New sale on Congress of Beauty.

Items:
${lines}

Total: ${total}

Customer: ${customer?.name ?? "(no name)"} <${customer?.email ?? "(no email)"}>

Ship to:
${shipTo}

Stripe session: ${session.id}

These pieces now show as sold on the site automatically.`;

    const slugList = items.map((i) => i.slug).filter(Boolean).join(", ");

    try {
      await getResend().emails.send(
        {
          from: SALE_FROM_EMAIL,
          to: getSaleNotificationEmail(),
          subject: `${doubleSold.length ? "DOUBLE SALE: " : "Sale: "}${slugList || session.id}`,
          text,
        },
        { idempotencyKey: `sale-notification/${session.id}` },
      );
    } catch (err) {
      // Never return 500 just because the notification email failed: the
      // payment already succeeded, and a 500 here causes Stripe to retry,
      // which would silently duplicate emails once Resend recovers.
      console.error("Sale notification email failed", {
        sessionId: session.id,
        slugList,
        error: err instanceof Error ? err.message : err,
      });
    }

    if (customer?.email && doubleSold.length === 0) {
      const emailInput = {
        firstName: customer.name?.split(" ")[0],
        items: items.map((i) => {
          const artwork = i.slug ? getArtwork(i.slug) : undefined;
          const thumb = artwork ? getThumbnail(artwork) : undefined;
          return {
            name: i.name,
            price: formatAmount(i.amount ?? 0, i.currency ?? "usd"),
            imageUrl: thumb ? absoluteUrl(thumb.src) : undefined,
          };
        }),
        total,
        shipTo: shipToLines,
      };

      try {
        // Idempotency key keeps Stripe retries (including after a cold start
        // clears processedEventIds) from emailing the customer twice.
        const sent = await getResend().emails.send(
          {
            from: SALE_FROM_EMAIL,
            to: customer.email,
            replyTo: getSaleNotificationEmail(),
            subject: "Your Congress of Beauty order",
            html: orderConfirmationHtml(emailInput),
            text: orderConfirmationText(emailInput),
          },
          { idempotencyKey: `order-confirmation/${session.id}` },
        );
        // Resend usually reports failures in the result rather than throwing.
        if (sent.error) {
          console.error("Order confirmation email failed", {
            sessionId: session.id,
            error: sent.error,
          });
        }
      } catch (err) {
        console.error("Order confirmation email failed", {
          sessionId: session.id,
          error: err instanceof Error ? err.message : err,
        });
      }
    }
  }

  if (event.type === "checkout.session.completed") {
    // Refresh every page so sold pieces show as sold on the next visit.
    revalidatePath("/", "layout");
  }

  processedEventIds.add(event.id);
  if (processedEventIds.size > PROCESSED_LIMIT) {
    const oldest = processedEventIds.values().next().value;
    if (oldest) processedEventIds.delete(oldest);
  }

  return NextResponse.json({ received: true });
}
