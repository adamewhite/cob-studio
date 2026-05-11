'use client';

import { useCart } from '../../components/CartContext';

export function ReopenCart() {
  const { openCart, items, hydrated } = useCart();
  if (!hydrated || items.length === 0) return null;
  return (
    <button
      type='button'
      onClick={openCart}
      className='inline-block border-b border-black/40 pb-1 text-base hover:border-black'
    >
      Review your cart
    </button>
  );
}
