import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "../../lib/stripe";
import { getArtwork } from "../../lib/artwork";
import { getPaidSlugs } from "../../lib/sold";

export async function POST(request: NextRequest) {
  let body: { slugs?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slugs = body.slugs;
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (new Set(slugs).size !== slugs.length) {
    return NextResponse.json(
      { error: "Invalid cart contents" },
      { status: 400 },
    );
  }

  // Live check against Stripe so a one-of-one can't be bought twice, even
  // before the site's cached pages catch up. Fails closed: if Stripe can't
  // be asked, don't risk selling a piece that's already gone.
  let paid: Set<string>;
  try {
    paid = await getPaidSlugs();
  } catch (err) {
    console.error("Sold check failed at checkout", {
      error: err instanceof Error ? err.message : err,
    });
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }

  const origin = request.nextUrl.origin;
  const lineItems: Array<{
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
        metadata: { slug: string };
      };
    };
  }> = [];

  for (const slug of slugs) {
    if (typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid cart contents" },
        { status: 400 },
      );
    }
    const artwork = getArtwork(slug);
    if (!artwork) {
      return NextResponse.json(
        { error: `Artwork not found: ${slug}` },
        { status: 400 },
      );
    }
    if (artwork.sold || paid.has(artwork.slug)) {
      return NextResponse.json(
        { error: `${artwork.title} has sold` },
        { status: 409 },
      );
    }

    const cover = artwork.images?.[0];
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(artwork.price * 100),
        product_data: {
          name: artwork.title,
          description: `${artwork.medium} · ${artwork.dimensions}`,
          images: cover ? [`${origin}${cover.src}`] : undefined,
          metadata: { slug: artwork.slug },
        },
      },
    });
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    // Read back by getPaidSlugs to mark these pieces sold once paid.
    metadata: { slugs: lineItems.map((li) => li.price_data.product_data.metadata.slug).join(",") },
    shipping_address_collection: { allowed_countries: ["US"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "usd" },
          display_name: "Free shipping",
        },
      },
    ],
    // TODO: re-enable once the Maine Revenue Services sales tax account is
    // registered (sole proprietor + EIN) and added under Tax > Registrations
    // in the Stripe Dashboard.
    automatic_tax: { enabled: false },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel`,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe did not return a checkout URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
