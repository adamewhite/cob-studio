import type { Metadata } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import Link from 'next/link';
import { FadeImage } from '../components/FadeImage';
import { Feature, PieceCard } from '../components/FeatureSplit';
import { wallProducts } from '../client/ImageWall';
import { HeroVideo } from '../components/HeroVideo';
import {
  artworks,
  categories,
  getArtworksByCategory,
  getThumbnail,
  seriesList,
  type Artwork,
} from '../lib/artwork';
import { withLiveSold } from '../lib/sold';
import { accents } from '../lib/accents';

// Hybrid layout option: the site's home page (nav, hero video, collections,
// footer) with the /client mockup's lowercase serif captions and fade-in
// images. The area under the hero follows whatsupton.com: a New Arrivals
// row, then split features that alternate sides.
export const metadata: Metadata = {
  title: 'Layout option: hybrid',
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

// Source Serif 4 is the current release of Source Serif Pro.
const serif = Source_Serif_4({ subsets: ['latin'] });

// Small lowercase caption text from the /client mockup, set in serif.
const mono = 'text-[14px] leading-[20px] lowercase text-[#636363]';
const monoStyle = { fontFamily: serif.style.fontFamily };

export default async function TestHome() {
  const live = await withLiveSold(artworks);
  const bySlug = (slug: string) => live.find((a) => a.slug === slug);
  const pick = (...slugs: string[]) =>
    slugs.map(bySlug).filter((a): a is Artwork => Boolean(a));
  const newArrivals = wallProducts(live).slice(0, 4);
  const botanical = seriesList.find((s) => s.slug === 'botanical');
  const drawingSize = bySlug('drawing-no-3')?.dimensions;
  const collectionCols =
    categories.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  const collectionSizes =
    categories.length >= 3
      ? '(min-width: 768px) 33vw, 100vw'
      : '(min-width: 768px) 50vw, 100vw';

  return (
    <div>
      <section className='relative w-full pt-0 sm:pt-[4.4rem]'>
        <HeroVideo />
        <div className='absolute inset-x-0 bottom-0 top-0 flex items-center px-10 sm:top-[4.4rem] sm:px-10'>
          <div className='mx-auto flex w-full max-w-7xl flex-col gap-4'>
            <div className='surface-panel max-w-sm p-5 shadow-xl shadow-ink/10 sm:p-6'>
              <h1
                className='text-balance text-[18px] leading-[26px] lowercase text-[#636363]'
                style={monoStyle}
              >
                paintings, drawings and sculpture made by hand in the mountains
                of maine.
              </h1>
              <div
                className='mt-4 flex gap-5 text-[14px] lowercase text-black'
                style={monoStyle}
              >
                <Link href='/artwork' className='hover:underline'>
                  shop the studio →
                </Link>
                <Link href='/about' className='hover:underline'>
                  about the work →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='px-6 pt-16 pb-8 sm:px-8 sm:pt-20'>
        <h2 className='mb-6 font-display text-2xl leading-[30px] tracking-[0.6px] text-[#1a1a1a]'>
          New Arrivals
        </h2>
        <div className='grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4'>
          {newArrivals.map((a) => (
            <PieceCard
              key={a.slug}
              artwork={a}
              sizes='(min-width: 768px) 25vw, 50vw'
            />
          ))}
        </div>
      </section>

      <Feature
        eyebrow='One of one, framed and ready to hang'
        title='Botanical Paintings'
        body={botanical?.blurb ?? ''}
        href='/artwork/series/botanical'
        pieces={pick('botanical-no-3', 'botanical-no-4')}
        large={accents.indianPipes}
      />

      <Feature
        flip
        eyebrow='Graphite on paper'
        title='Drawings'
        body={`Original graphite drawings on paper${
          drawingSize ? `, each ${drawingSize}` : ''
        }.`}
        href='/artwork/drawings'
        pieces={pick('drawing-no-3', 'drawing-no-4')}
        large={accents.boulder}
      />

      <section className='mx-auto max-w-7xl px-6 pt-8 pb-12 sm:py-16'>
        <h2 className={`mb-6 text-black ${mono}`} style={monoStyle}>
          browse by collection
        </h2>
        <div className={`grid gap-6 ${collectionCols}`}>
          {categories.map((c) => {
            const first = getArtworksByCategory(c.slug)[0];
            const cover = c.cover ?? (first && getThumbnail(first));
            return (
              <Link
                key={c.slug}
                href={`/artwork/${c.slug}`}
                className='group block'
              >
                <div className='relative aspect-[3/2] w-full overflow-hidden bg-white'>
                  {cover && (
                    <FadeImage
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      sizes={collectionSizes}
                      style={{ objectPosition: cover.position }}
                      className='object-cover'
                    />
                  )}
                </div>
                <div className={`mt-2 ${mono}`} style={monoStyle}>
                  <span className='text-black group-hover:underline'>
                    {c.title}
                  </span>
                  {' / '}
                  {c.blurb}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
