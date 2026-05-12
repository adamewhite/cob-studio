"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { categories, seriesList } from "../lib/artwork";

export function ArtworkMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <div className="flex items-center">
        <Link href="/artwork" className="hover:opacity-60">
          Artwork
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close artwork menu" : "Open artwork menu"}
          onClick={() => setOpen((v) => !v)}
          className="-m-2 ml-0 p-2 text-black/60 hover:text-black"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M3 4.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
      >
        <div className="flex min-w-[14rem] flex-col gap-1 rounded-md border border-black/10 bg-white p-2 shadow-sm">
          <Link
            href="/artwork"
            onClick={() => setOpen(false)}
            className="rounded px-3 py-2 hover:bg-black/5"
          >
            All work
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/artwork/${c.slug}`}
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2 hover:bg-black/5"
            >
              {c.title}
            </Link>
          ))}
          {seriesList.length > 0 && (
            <>
              <div className="my-1 border-t border-black/10" />
              <div className="px-3 pt-1 text-xs uppercase tracking-wide text-black/40">
                Series
              </div>
              {seriesList.map((s) => (
                <Link
                  key={s.slug}
                  href={`/artwork/series/${s.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded px-3 py-2 hover:bg-black/5"
                >
                  {s.title}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
