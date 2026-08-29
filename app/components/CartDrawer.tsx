"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";
import { formatPrice } from "../lib/artwork";

export function CartDrawer() {
  const { items, isOpen, closeCart, remove, subtotal } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  async function handleCheckout() {
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: items.map((i) => i.slug) }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout failed. Please try again.");
        setCheckingOut(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setCheckingOut(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      openerRef.current?.focus();
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-ink/30 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal={isOpen ? true : undefined}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <h2 className="text-2xl font-medium tracking-tight">
            {items.length === 0 ? "Your cart is empty" : "Your cart"}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="-m-2 p-2 text-ink/60 hover:text-ink"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-start px-8 pt-8">
            <Link
              href="/artwork"
              onClick={closeCart}
              className="border-b border-ink/40 pb-1 text-base hover:border-ink"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-8">
            {items.map((item) => (
              <li
                key={item.slug}
                className="flex gap-5 border-t border-ink/10 py-6 first:border-t-0 first:pt-0"
              >
                <Link
                  href={`/artwork/${item.category}/${item.slug}`}
                  onClick={closeCart}
                  className="shrink-0"
                >
                  {item.image ? (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={88}
                      height={110}
                      className="h-[110px] w-[88px] object-cover"
                    />
                  ) : (
                    <div className="h-[110px] w-[88px] bg-ink/5" />
                  )}
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/artwork/${item.category}/${item.slug}`}
                      onClick={closeCart}
                      className="text-base leading-snug hover:underline"
                    >
                      {item.title}
                    </Link>
                    <div className="text-base tabular-nums">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-ink/50">
                    {item.medium}
                  </div>

                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => remove(item.slug)}
                      className="text-sm text-ink/50 underline-offset-4 hover:text-ink hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-ink/10 px-8 py-6">
          <div
            className="-mx-8 mb-6 px-8 py-2 text-center text-xs tracking-wide text-bright"
            style={{ backgroundColor: "rgb(42, 65, 42)" }}
          >
            FREE shipping on U.S. orders.
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-base">Estimated total</div>
            <div className="text-base tabular-nums">
              {formatPrice(subtotal)} USD
            </div>
          </div>
          <p className="mt-2 text-xs text-ink/50">
            Taxes, discounts and shipping calculated at checkout.
          </p>

          {error && (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={items.length === 0 || checkingOut}
            onClick={handleCheckout}
            className="mt-6 w-full bg-ink px-6 py-4 text-base text-bright transition hover:bg-ink/80 disabled:cursor-not-allowed disabled:bg-ink/30"
          >
            {checkingOut ? "Redirecting…" : "Check out"}
          </button>
        </div>
      </aside>
    </>
  );
}
