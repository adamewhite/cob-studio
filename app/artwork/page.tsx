import Link from "next/link";
import { Accent } from "../components/Accent";
import { ArtworkCard } from "../components/ArtworkCard";
import { artworks, categories } from "../lib/artwork";

export const metadata = {
  title: "Artwork",
  description:
    "Original paintings, drawings, and cast sculpture from Congress of Beauty.",
};

export default function ArtworkIndex() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:pt-[8.4rem]">
      <div className="mb-12">
        <h1 className="text-3xl font-medium tracking-tight">Artwork</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="border border-black bg-black px-3 py-1 text-white">
            All
          </span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/artwork/${c.slug}`}
              className="border border-black/20 px-3 py-1 hover:bg-black/5"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {artworks.slice(0, 12).map((a) => (
          <ArtworkCard key={a.slug} artwork={a} />
        ))}
      </div>
      <Accent
        name="shellCreekWide"
        className="my-12 h-24 w-full sm:h-32"
        sizes="(min-width: 1280px) 1232px, 100vw"
      />
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {artworks.slice(12).map((a) => (
          <ArtworkCard key={a.slug} artwork={a} />
        ))}
      </div>
    </div>
  );
}
