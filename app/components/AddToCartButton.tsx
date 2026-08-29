"use client";

import type { Artwork } from "../lib/artwork";
import { useCart } from "./CartContext";

export function AddToCartButton({ artwork }: { artwork: Artwork }) {
  const { add, items } = useCart();
  const inCart = items.some((i) => i.slug === artwork.slug);

  return (
    <button
      type="button"
      onClick={() => add(artwork)}
      disabled={inCart}
      className="w-full bg-ink px-6 py-3.5 text-base text-bright transition hover:bg-ink/80 disabled:cursor-not-allowed disabled:bg-ink/30 sm:w-auto"
    >
      {inCart ? "In cart" : "Add to cart"}
    </button>
  );
}
