import "server-only";
import type Stripe from "stripe";
import type { Artwork } from "./artwork";
import { getStripe } from "./stripe";

// Pieces paid for through Stripe Checkout, so a sale marks a piece sold
// without editing artwork.ts. Each checkout session records its slugs in
// metadata.slugs when created (see app/api/checkout/route.ts); sessions from
// before that existed carry no slugs and are ignored. A fully refunded
// session doesn't count, so a returned piece goes back on sale.
export async function getPaidSlugs({
  excludeSessionId,
}: { excludeSessionId?: string } = {}): Promise<Set<string>> {
  const slugs = new Set<string>();
  const sessions = getStripe().checkout.sessions.list({
    status: "complete",
    limit: 100,
    expand: ["data.payment_intent.latest_charge"],
  });
  for await (const session of sessions) {
    if (session.id === excludeSessionId) continue;
    if (session.payment_status !== "paid") continue;
    const recorded = session.metadata?.slugs;
    if (!recorded) continue;

    const intent = session.payment_intent as Stripe.PaymentIntent | null;
    const charge = intent?.latest_charge as Stripe.Charge | null | undefined;
    if (charge?.refunded) continue;

    for (const slug of recorded.split(",")) {
      if (slug) slugs.add(slug);
    }
  }
  return slugs;
}

// Pages render in bursts (a build, or every page after a sale), so share one
// Stripe lookup across them briefly. Checkout calls getPaidSlugs directly.
const DISPLAY_TTL_MS = 30 * 1000;
let displayCache: { at: number; paid: Promise<Set<string>> } | null = null;

// Marks pieces sold if they've been paid for, on top of any `sold: true` set
// by hand. If Stripe can't be reached, falls back to the hand-set flags so
// pages still render; checkout does its own strict check.
export async function withLiveSold(list: Artwork[]): Promise<Artwork[]> {
  if (!displayCache || Date.now() - displayCache.at > DISPLAY_TTL_MS) {
    displayCache = { at: Date.now(), paid: getPaidSlugs() };
  }
  let paid: Set<string>;
  try {
    paid = await displayCache.paid;
  } catch (err) {
    displayCache = null;
    console.error("Sold lookup failed; using hand-set flags only", {
      error: err instanceof Error ? err.message : err,
    });
    return list;
  }
  return list.map((a) => (paid.has(a.slug) ? { ...a, sold: true } : a));
}
