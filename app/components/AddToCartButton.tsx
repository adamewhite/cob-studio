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
      className="w-full bg-black px-6 py-3.5 text-base text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/30 sm:w-auto"
    >
      {inCart ? "In cart" : "Add to cart"}
    </button>
  );
}
