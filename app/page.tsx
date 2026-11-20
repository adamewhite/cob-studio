import Link from "next/link";
import { AccentCarousel } from "./components/AccentCarousel";
import { ArtworkCard } from "./components/ArtworkCard";
import { Feature } from "./components/FeatureSplit";
import { HeroVideo } from "./components/HeroVideo";
import { accents } from "./lib/accents";
import { artworks, seriesList, type Category } from "./lib/artwork";
import { withLiveSold } from "./lib/sold";

// Sold pieces come from Stripe; the sale webhook refreshes pages right away,
// and this catches anything it misses (refunds, a failed webhook).
export const revalidate = 3600;

export default async function Home() {
  const live = await withLiveSold(artworks);
  const newArrivals = live.slice(0, 4);
  // Two pieces per section that aren't already in New arrivals.
  const featured = (category: Category) =>
    live
      .filter((a) => a.category === category && !newArrivals.includes(a))
      .slice(0, 2);
  const botanical = seriesList.find((s) => s.slug === "botanical");
  const drawingSize = live.find((a) => a.category === "drawings")?.dimensions;

  return (
    <div>
      <section className="relative w-full pt-0 sm:pt-[4.4rem]">
        <HeroVideo />
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

      <Feature
        eyebrow="One of one, framed and ready to hang"
        title="Botanical Paintings"
        body={botanical?.blurb ?? ""}
        href="/artwork/series/botanical"
        pieces={featured("paintings")}
        large={accents.indianPipes}
      />

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

      <Feature
        flip
        eyebrow="Graphite on paper"
        title="Drawings"
        body={`Original graphite drawings on paper${
          drawingSize ? `, each ${drawingSize}` : ""
        }.`}
        href="/artwork/drawings"
        pieces={featured("drawings")}
        large={accents.boulder}
      />
    </div>
  );
}
