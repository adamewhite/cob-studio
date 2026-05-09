"use client";

import { useCart } from "./CartContext";

export function CartTrigger() {
  const { items, openCart } = useCart();
  const count = items.length;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative inline-flex items-center hover:opacity-60"
    >
      <span>Cart</span>
      {count > 0 && (
        <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-xs text-white tabular-nums">
          {count}
        </span>
      )}
    </button>
  );
}
