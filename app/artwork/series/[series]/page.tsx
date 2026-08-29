import Link from "next/link";
import { notFound } from "next/navigation";
import { Accent } from "../../../components/Accent";
import { ArtworkCard } from "../../../components/ArtworkCard";
import { Series, getArtworksBySeries, seriesList } from "../../../lib/artwork";
import { AccentName } from "../../../lib/accents";

const seriesAccents: Partial<Record<Series, AccentName>> = {
  botanical: "sumac",
};

export function generateStaticParams() {
  return seriesList.map((s) => ({ series: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series } = await params;
  const s = seriesList.find((x) => x.slug === series);
  if (!s) return {};
  return { title: `${s.title} series`, description: s.blurb };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series } = await params;
  const s = seriesList.find((x) => x.slug === series);
  if (!s) notFound();

  const works = getArtworksBySeries(series as Series);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <nav className="mb-6 text-sm text-black/50">
        <Link href="/artwork" className="hover:text-black">
          Artwork
        </Link>
        <span className="mx-2">/</span>
        <span>{s.title}</span>
      </nav>

      <div className="mb-12 flex items-end justify-between gap-8">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">{s.title}</h1>
          <p className="mt-3 max-w-xl text-base text-black/60">{s.blurb}</p>
        </div>
        <Accent
          name={seriesAccents[s.slug] ?? "polyporeBench"}
          className="hidden aspect-[5/4] w-44 shrink-0 sm:block"
          sizes="176px"
        />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {works.map((a) => (
          <ArtworkCard key={a.slug} artwork={a} />
        ))}
      </div>
    </div>
  );
}
