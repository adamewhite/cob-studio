"use client";

import Image from "next/image";
import { useRef } from "react";
import { AccentName, accents } from "../lib/accents";

// Horizontal, swipeable strip of accent photos. Arrows page by one
// screenful; scroll-snap keeps tiles aligned.
export function AccentCarousel({ names }: { names: AccentName[] }) {
  const track = useRef<HTMLDivElement>(null);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {names.map((name) => {
          const accent = accents[name];
          return (
            <div
              key={name}
              className="relative aspect-[3/4] w-[calc((100%-0.5rem)/2)] shrink-0 snap-start overflow-hidden bg-veil sm:w-[calc((100%-3rem)/3)]"
            >
              <Image
                src={accent.src}
                alt={accent.alt}
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
        aria-label="Previous photos"
        onClick={() => page(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-bright/80 px-3 py-2 text-base backdrop-blur hover:bg-bright"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next photos"
        onClick={() => page(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-bright/80 px-3 py-2 text-base backdrop-blur hover:bg-bright"
      >
        →
      </button>
    </div>
  );
}
