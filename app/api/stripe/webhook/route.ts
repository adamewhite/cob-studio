import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "../../../lib/stripe";
import {
  getResend,
  SALE_FROM_EMAIL,
  getSaleNotificationEmail,
} from "../../../lib/resend";

export const runtime = "nodejs";

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

    const formatAmount = (cents: number, currency: string) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(cents / 100);

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

    const shipTo = shipping?.address
      ? [
          shipping.name,
          shipping.address.line1,
          shipping.address.line2,
          `${shipping.address.city ?? ""}, ${shipping.address.state ?? ""} ${shipping.address.postal_code ?? ""}`,
          shipping.address.country,
        ]
          .filter(Boolean)
          .join("\n")
      : "(no shipping address)";

    const text = `New sale on Congress of Beauty.

Items:
${lines}

Total: ${total}

Customer: ${customer?.name ?? "(no name)"} <${customer?.email ?? "(no email)"}>

Ship to:
${shipTo}

Stripe session: ${session.id}

Mark these slugs as sold:true in app/lib/artwork.ts and redeploy.`;

    const slugList = items.map((i) => i.slug).filter(Boolean).join(", ");

    await getResend().emails.send({
      from: SALE_FROM_EMAIL,
      to: getSaleNotificationEmail(),
      subject: `Sale: ${slugList || session.id}`,
      text,
    });
  }

  return NextResponse.json({ received: true });
}
