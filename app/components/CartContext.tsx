"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Artwork } from "../lib/artwork";

export type CartItem = {
  slug: string;
  title: string;
  category: Artwork["category"];
  medium: string;
  price: number;
  image?: { src: string; alt: string };
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  add: (artwork: Artwork) => void;
  remove: (slug: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cob-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((artwork: Artwork) => {
    setItems((prev) => {
      if (prev.some((i) => i.slug === artwork.slug)) return prev;
      const cover = artwork.images?.[0];
      return [
        ...prev,
        {
          slug: artwork.slug,
          title: artwork.title,
          category: artwork.category,
          medium: artwork.medium,
          price: artwork.price,
          image: cover ? { src: cover.src, alt: cover.alt } : undefined,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      hydrated,
      add,
      remove,
      clear,
      openCart,
      closeCart,
      subtotal,
    }),
    [items, isOpen, hydrated, add, remove, clear, openCart, closeCart, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
