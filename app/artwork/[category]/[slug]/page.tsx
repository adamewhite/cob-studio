import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "../../../components/AddToCartButton";
import { Carousel } from "../../../components/Carousel";
import {
  artworks,
  categories,
  formatPrice,
  getArtwork,
  seriesList,
} from "../../../lib/artwork";

export function generateStaticParams() {
  return artworks.map((a) => ({ category: a.category, slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const a = getArtwork(slug);
  if (!a) return {};
  const description = `${a.title} — ${a.medium}, ${a.dimensions}.`;
  const cover = a.images?.[0];
  const images = cover ? [{ url: cover.src, alt: cover.alt }] : undefined;
  return {
    title: a.title,
    description,
    openGraph: {
      title: a.title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description,
      images,
    },
  };
}

export default async function ArtworkDetail({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const a = getArtwork(slug);
  if (!a || a.category !== category) notFound();

  const c = categories.find((c) => c.slug === a.category)!;
  const s = a.series ? seriesList.find((s) => s.slug === a.series) : undefined;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <nav className="mb-8 text-sm text-black/50">
        <Link href="/artwork" className="hover:text-black">
          Artwork
        </Link>
        <span className="mx-2">/</span>
        {s ? (
          <Link href={`/artwork/series/${s.slug}`} className="hover:text-black">
            {s.title}
          </Link>
        ) : (
          <Link href={`/artwork/${c.slug}`} className="hover:text-black">
            {c.title}
          </Link>
        )}
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          {a.images && a.images.length > 0 ? (
            <Carousel images={a.images} />
          ) : (
            <div
              className={`aspect-[4/5] w-full bg-gradient-to-br ${a.gradient ?? ""}`}
            />
          )}
        </div>

        <div className="md:pt-4">
          <h1 className="text-3xl font-medium tracking-tight">{a.title}</h1>
          <div className="mt-2 text-base text-black/60">
            {a.medium} · {a.dimensions} · {a.year}
          </div>

          <div className="mt-8 text-2xl tabular-nums">
            {a.sold ? (
              <span className="text-black/40">Sold</span>
            ) : (
              formatPrice(a.price)
            )}
          </div>

          {!a.sold && <AddToCartButton artwork={a} />}

          {a.description && (
            <p className="mt-10 max-w-md text-base leading-relaxed text-black/70">
              {a.description}
            </p>
          )}

          <dl className="mt-10 space-y-3 border-t border-black/10 pt-6 text-base">
            <div className="flex justify-between gap-6">
              <dt className="text-black/50">Medium</dt>
              <dd>{a.medium}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-black/50">Dimensions</dt>
              <dd>{a.dimensions}</dd>
            </div>
            {a.framedDimensions && (
              <div className="flex justify-between gap-6">
                <dt className="text-black/50">Framed</dt>
                <dd>{a.framedDimensions}</dd>
              </div>
            )}
            <div className="flex justify-between gap-6">
              <dt className="text-black/50">Year</dt>
              <dd>{a.year}</dd>
            </div>
            {s && (
              <div className="flex justify-between gap-6">
                <dt className="text-black/50">Series</dt>
                <dd>
                  <Link
                    href={`/artwork/series/${s.slug}`}
                    className="hover:text-black"
                  >
                    {s.title}
                  </Link>
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-6">
              <dt className="text-black/50">Edition</dt>
              <dd>One of one</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
