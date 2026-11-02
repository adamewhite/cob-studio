import Image from "next/image";
import Link from "next/link";
import { AccentCarousel } from "./components/AccentCarousel";
import { ArtworkCard } from "./components/ArtworkCard";
import {
  artworks,
  categories,
  getArtworksByCategory,
  getThumbnail,
} from "./lib/artwork";
import { withLiveSold } from "./lib/sold";

// Sold pieces come from Stripe; the sale webhook refreshes pages right away,
// and this catches anything it misses (refunds, a failed webhook).
export const revalidate = 3600;

export default async function Home() {
  const newArrivals = await withLiveSold(artworks.slice(0, 4));
  // One card per visible category. Columns follow the count so the row
  // always spans the full width, e.g. while a category is hidden.
  const collectionCount = categories.length;
  const collectionCols =
    collectionCount >= 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  const collectionSizes =
    collectionCount >= 3
      ? "(min-width: 768px) 33vw, 100vw"
      : "(min-width: 768px) 50vw, 100vw";

  return (
    <div>
      <section className="relative w-full pt-0 sm:pt-[4.4rem]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
          aria-label="Congress of Beauty studio"
          // Purely decorative: ignore taps so iOS never shows its native
          // controls (timeline, fullscreen, PiP, AirPlay) over the hero.
          disablePictureInPicture
          disableRemotePlayback
          className="hero-video pointer-events-none h-[70vh] w-full object-cover sm:h-[80vh]"
        >
          {/* Phones get a lighter 720p file; H.264 before WebM so iOS uses
              hardware decoding. Color grading is baked into the files. */}
          <source
            src="/videos/hero-720.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source src="/videos/hero-1080.mp4" type="video/mp4" />
          <source src="/videos/hero-1080.webm" type="video/webm" />
        </video>
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center px-10 sm:top-[4.4rem] sm:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
            <div className="surface-panel max-w-md p-5 shadow-xl shadow-ink/10 sm:p-6">
              <h1 className="max-w-md text-balance text-xl font-normal leading-snug tracking-tight text-ink/60 sm:text-2xl">
                Paintings, drawings and sculpture made by hand in the mountains
                of Maine.
              </h1>
            </div>
            <div className="surface-panel flex max-w-md flex-col gap-3 p-5 shadow-xl shadow-ink/10 sm:flex-row sm:p-6">
              <Link
                href="/artwork"
                className="bg-pine px-6 py-3.5 text-center text-base text-bright hover:bg-pine/80 sm:flex-1"
              >
                Shop the studio
              </Link>
              <Link
                href="/about"
                className="border border-pine px-6 py-3.5 text-center text-base hover:bg-pine/5 sm:flex-1"
              >
                About the work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-2xl font-medium tracking-tight">New arrivals</h2>
          <Link href="/artwork" className="text-sm text-ink/60 hover:text-ink">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {newArrivals.map((a) => (
            <ArtworkCard key={a.slug} artwork={a} />
          ))}
        </div>
      </section>

      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12">
          <AccentCarousel
            names={[
              "sumac",
              "reishi",
              "shellCreekGold",
              "barnWindow",
              "applesField",
              "puffball",
              "boulder",
              "lichen",
              "polyporeLog",
              "irisesBundled",
              "bolete",
              "shellCreekDark",
              "polyporeHostas",
              "applesNight",
              "irisesWrapped",
              "overlook",
            ]}
          />
          <p className="mt-4 max-w-xl text-sm text-ink/50">
            Gathered from the studio&apos;s corner of Maine — the woods, the
            orchard, and work finding its way back outside.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12 sm:py-16">
        <h2 className="mb-8 text-2xl font-medium tracking-tight">
          Browse by collection
        </h2>
        <div className={`grid gap-6 ${collectionCols}`}>
          {categories.map((c) => {
              // The grid thumbnail is cropped with the piece centered, which
              // holds up when the card crops it again to 3:2.
              const first = getArtworksByCategory(c.slug)[0];
              const cover = c.cover ?? (first && getThumbnail(first));
              return (
                <Link
                  key={c.slug}
                  href={`/artwork/${c.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-veil">
                    {cover ? (
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes={collectionSizes}
                        style={{ objectPosition: cover.position }}
                        className="object-cover transition-opacity group-hover:opacity-90"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-veil-mid via-veil-deep to-veil-deepest transition-opacity group-hover:opacity-90" />
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="text-base">{c.title}</div>
                    <div className="text-sm text-ink/50">{c.blurb}</div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
}
