"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Artwork } from "../lib/artwork";
import { absoluteUrl } from "../lib/site";

export function ShareButton({
  artwork,
  category,
}: {
  artwork: Artwork;
  category: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const url = absoluteUrl(`/artwork/${category}/${artwork.slug}`);
  const title = artwork.title;
  const text = `${artwork.title} — Congress of Beauty`;
  const cover = artwork.images?.[0];
  const mediaUrl = cover ? absoluteUrl(cover.src) : "";

  // Close the fallback menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User dismissed the share sheet — nothing to do.
      }
      return;
    }
    setOpen((v) => !v);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — leave the menu open so the links still work.
    }
  }

  function openInNewTab(href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(mediaUrl)}&description=${encodeURIComponent(text)}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    },
  ];

  return (
    <div ref={containerRef} className="relative w-full sm:w-auto sm:inline-block">
      <button
        type="button"
        onClick={handleShare}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Share ${artwork.title}`}
        className="w-full border border-ink/20 px-6 py-3.5 text-base transition hover:border-ink sm:w-auto"
      >
        Share
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 z-10 mt-2 w-44 border border-ink/10 bg-bright py-2 shadow-sm"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleCopy}
            className="block w-full px-4 py-2 text-left text-base transition hover:opacity-60"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
          {links.map((l) => (
            <button
              key={l.label}
              type="button"
              role="menuitem"
              onClick={() => openInNewTab(l.href)}
              className="block w-full px-4 py-2 text-left text-base transition hover:opacity-60"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
