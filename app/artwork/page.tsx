import Link from "next/link";
import { Accent } from "../components/Accent";
import { ArtworkCard } from "../components/ArtworkCard";
import { artworks, categories } from "../lib/artwork";
import { withLiveSold } from "../lib/sold";

export const metadata = {
  title: "Artwork",
  description:
    "Original paintings and drawings from Congress of Beauty.",
};

// Sold pieces come from Stripe; the sale webhook refreshes pages right away,
// and this catches anything it misses (refunds, a failed webhook).
export const revalidate = 3600;

export default async function ArtworkIndex() {
  const live = await withLiveSold(artworks);
  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:pt-28">
      <div className="mb-12">
        <h1 className="text-3xl font-medium tracking-tight">Artwork</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="border border-ink bg-ink px-3 py-1 text-bright">
            All
          </span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/artwork/${c.slug}`}
              className="border border-ink/20 px-3 py-1 hover:bg-ink/5"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {live.slice(0, 12).map((a) => (
          <ArtworkCard key={a.slug} artwork={a} />
        ))}
      </div>
      <Accent
        name="shellCreekWide"
        className="my-12 h-24 w-full sm:h-32"
        sizes="(min-width: 1280px) 1232px, 100vw"
      />
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {live.slice(12).map((a) => (
          <ArtworkCard key={a.slug} artwork={a} />
        ))}
      </div>
    </div>
  );
}
