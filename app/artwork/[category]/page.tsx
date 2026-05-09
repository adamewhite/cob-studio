import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkCard } from "../../components/ArtworkCard";
import {
  Category,
  categories,
  getArtworksByCategory,
} from "../../lib/artwork";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = categories.find((c) => c.slug === category);
  if (!c) return {};
  return { title: c.title, description: c.blurb };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = categories.find((c) => c.slug === category);
  if (!c) notFound();

  const works = getArtworksByCategory(category as Category);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-medium tracking-tight">{c.title}</h1>
        <p className="mt-3 max-w-xl text-black/60">{c.blurb}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link
            href="/artwork"
            className="border border-black/20 px-3 py-1 hover:bg-black/5"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/artwork/${cat.slug}`}
              className={
                cat.slug === c.slug
                  ? "border border-black bg-black px-3 py-1 text-white"
                  : "border border-black/20 px-3 py-1 hover:bg-black/5"
              }
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {works.map((a) => (
          <ArtworkCard key={a.slug} artwork={a} />
        ))}
      </div>
    </div>
  );
}
