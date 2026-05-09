"use client";

import { useEffect } from "react";
import { useCart } from "../../components/CartContext";

export function ClearCartOnMount() {
  const { clear, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) clear();
  }, [hydrated, clear]);
  return null;
}
