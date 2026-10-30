"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AccentName, accents } from "../lib/accents";

// Horizontal, swipeable strip of accent photos that loops endlessly. The list
// is rendered three times; whenever scrolling settles outside the middle copy,
// the track jumps by one copy's width to the identical spot in the middle.
export function AccentCarousel({ names }: { names: AccentName[] }) {
  const track = useRef<HTMLDivElement>(null);

  // Width of one copy of the list, including the gap that follows it.
  const setWidth = (el: HTMLDivElement) =>
    (el.children[names.length] as HTMLElement).offsetLeft -
    (el.children[0] as HTMLElement).offsetLeft;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.scrollLeft = setWidth(el);

    let settle: ReturnType<typeof setTimeout>;
    const recenter = () => {
      const w = setWidth(el);
      if (el.scrollLeft < w * 0.5) el.scrollLeft += w;
      else if (el.scrollLeft >= w * 1.5) el.scrollLeft -= w;
    };
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(recenter, 150);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(settle);
      el.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names.length]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const [a, b] = [el.children[0], el.children[1]] as HTMLElement[];
    el.scrollBy({ left: dir * (b.offsetLeft - a.offsetLeft), behavior: "smooth" });
  };

  const loop = [...names, ...names, ...names];

  return (
    <div className="relative">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {loop.map((name, i) => {
          const accent = accents[name];
          const clone = i < names.length || i >= names.length * 2;
          return (
            <div
              key={i}
              aria-hidden={clone || undefined}
              className="relative aspect-[3/4] w-[calc((100%-0.5rem)/2)] shrink-0 snap-start overflow-hidden bg-veil sm:w-[calc((100%-3rem)/3)]"
            >
              <Image
                src={accent.src}
                alt={clone ? "" : accent.alt}
                fill
                sizes="(min-width: 1280px) 400px, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => step(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-bright/80 px-3 py-2 text-base backdrop-blur hover:bg-bright"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => step(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-bright/80 px-3 py-2 text-base backdrop-blur hover:bg-bright"
      >
        →
      </button>
    </div>
  );
}
