import Image from "next/image";
import Link from "next/link";
import { Accent } from "./components/Accent";
import { ArtworkCard } from "./components/ArtworkCard";
import {
  artworks,
  categories,
  getArtworksBySeries,
  seriesList,
} from "./lib/artwork";

export default function Home() {
  const newArrivals = artworks.slice(0, 4);
  const botanical = seriesList[0];
  const botanicalCover = getArtworksBySeries(botanical.slug)[0]?.images?.[0];

  return (
    <div>
      <section className="relative w-full pt-0 sm:pt-[4.4rem]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero_poster.jpg"
          aria-label="Congress of Beauty studio"
          className="h-[70vh] w-full object-cover sm:h-[80vh]"
        >
          <source src="/videos/hero_video.mp4" type="video/mp4" />
          <source src="/videos/hero_video.webm" type="video/webm" />
        </video>
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center px-10 sm:top-[4.4rem] sm:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
            <div
              style={{
                background: "linear-gradient(180deg, #fcfbfa 0%, #f6f3f0 100%)",
              }}
              className="max-w-md p-5 shadow-xl shadow-black/10 sm:p-6"
            >
              <h1 className="text-balance text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                Live with beauty every day.
              </h1>
              <p className="mt-6 max-w-md text-balance text-black/60">
                Original work from Congress of Beauty — paintings, drawings, and
                cast sculpture, made by hand.
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(180deg, #fcfbfa 0%, #f6f3f0 100%)",
              }}
              className="flex max-w-md flex-col gap-3 p-5 shadow-xl shadow-black/10 sm:inline-flex sm:max-w-none sm:flex-row sm:self-start sm:p-6"
            >
              <Link
                href="/artwork"
                className="bg-black px-6 py-3.5 text-center text-base text-white hover:bg-black/80"
              >
                Shop the studio
              </Link>
              <Link
                href="/about"
                className="border border-black/20 px-6 py-3.5 text-center text-base hover:bg-black/5"
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
          <Link
            href="/artwork"
            className="text-sm text-black/60 hover:text-black"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {newArrivals.map((a) => (
            <ArtworkCard key={a.slug} artwork={a} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-6">
          <Accent
            name="sumac"
            className="aspect-[3/4]"
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 33vw, 50vw"
          />
          <Accent
            name="reishi"
            className="aspect-[3/4]"
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 33vw, 50vw"
          />
          <Accent
            name="shellCreekGold"
            className="hidden aspect-[3/4] sm:block"
            sizes="(min-width: 1280px) 400px, 33vw"
          />
        </div>
        <p className="mt-4 max-w-xl text-sm text-black/50">
          Gathered from the studio&apos;s corner of Maine — the woods, the
          orchard, and work finding its way back outside.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12 sm:py-16">
        <h2 className="mb-8 text-2xl font-medium tracking-tight">
          Browse by collection
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href={`/artwork/series/${botanical.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-stone-100">
              {botanicalCover ? (
                <Image
                  src={botanicalCover.src}
                  alt={botanicalCover.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-opacity group-hover:opacity-90"
                />
              ) : null}
            </div>
            <div className="mt-3">
              <div className="text-base">{botanical.title} series</div>
              <div className="text-sm text-black/50">{botanical.blurb}</div>
            </div>
          </Link>
          {categories
            .filter((c) => c.slug !== "paintings")
            .map((c) => (
              <Link
                key={c.slug}
                href={`/artwork/${c.slug}`}
                className="group block"
              >
                <div className="aspect-[3/2] w-full bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400 transition-opacity group-hover:opacity-90" />
                <div className="mt-3">
                  <div className="text-base">{c.title}</div>
                  <div className="text-sm text-black/50">{c.blurb}</div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
