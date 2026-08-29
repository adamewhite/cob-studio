import Image from "next/image";
import Link from "next/link";
import { Artwork, formatPrice, getCoverImage } from "../lib/artwork";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const cover = getCoverImage(artwork);
  const href = `/artwork/${artwork.category}/${artwork.slug}`;

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-veil">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${artwork.gradient ?? ""} transition-opacity group-hover:opacity-90`}
          />
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div>
          <div className="text-base">{artwork.title}</div>
          <div className="text-sm text-ink/50">{artwork.medium}</div>
        </div>
        <div className="text-base tabular-nums">
          {artwork.sold ? (
            <span className="text-ink/40">Sold</span>
          ) : (
            formatPrice(artwork.price)
          )}
        </div>
      </div>
    </Link>
  );
}
