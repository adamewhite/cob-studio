"use client";

import Image from "next/image";
import { useState } from "react";
import { ArtworkImage } from "../lib/artwork";

export function Carousel({ images }: { images: ArtworkImage[] }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const current = images[index];
  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
          className="object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => canPrev && setIndex(index - 1)}
              disabled={!canPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 px-3 py-2 text-base backdrop-blur hover:bg-white disabled:opacity-30"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => canNext && setIndex(index + 1)}
              disabled={!canNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 px-3 py-2 text-base backdrop-blur hover:bg-white disabled:opacity-30"
            >
              →
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === index}
              className={`relative aspect-square w-20 overflow-hidden bg-stone-100 transition ${
                i === index ? "ring-2 ring-black" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
