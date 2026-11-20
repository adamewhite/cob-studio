import type { Metadata } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import Link from 'next/link';
import { FadeImage } from '../client/FadeImage';
import { ImageWall, wallProducts, type WallSizing } from '../client/ImageWall';
import { HeroVideo } from '../components/HeroVideo';
import {
  artworks,
  categories,
  getArtworksByCategory,
  getThumbnail,
} from '../lib/artwork';
import { withLiveSold } from '../lib/sold';

// Hybrid layout option: the site's home page (nav, hero video, collections,
// footer) with the /client mockup's monospace captions, image wall, and
// fade-in images.
export const metadata: Metadata = {
  title: 'Layout option: hybrid',
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

// Four pieces, each paired with one large accent photo, sized so every
// row fills the 1232px content width (side-thumbnail pieces are 66px
// wider than listed). Narrower screens simply reflow.
const newArrivalsSizing: WallSizing = {
  productWidths: [600, 420, 540, 400],
  accentWidths: [592, 600, 600, 640],
  accentNames: ['shellCreekWide', 'reishi', 'mountainView', 'overlook'],
  accentsAfter: () => 1,
  // Rows alternate: piece then photo, then photo then piece.
  accentsFirst: (i) => i % 2 === 1,
  layoutClassName: 'justify-between gap-x-10 gap-y-20',
  // Tile by tile in page order, so no row shares a single top edge: the
  // shorter tile in each row drops to the bottom or middle.
  tileAlign: [
    'start',
    'end',
    'start',
    'end',
    'start',
    'center',
    'start',
    'center',
  ],
};

// Source Serif 4 is the current release of Source Serif Pro.
const serif = Source_Serif_4({ subsets: ['latin'] });

// Small lowercase caption text from the /client mockup, set in serif.
const mono = 'text-[14px] leading-[20px] lowercase text-[#636363]';
const monoStyle = { fontFamily: serif.style.fontFamily };

export default async function TestHome() {
  const products = wallProducts(await withLiveSold(artworks)).slice(0, 4);
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

      <section className='mx-auto max-w-7xl px-6 py-16'>
        <div
          className={`mb-6 flex items-baseline justify-between ${mono}`}
          style={monoStyle}
        >
          <h2 className='text-black'>new arrivals</h2>
          <Link href='/artwork' className='text-black hover:underline'>
            view all →
          </Link>
        </div>
        <div className={mono} style={monoStyle}>
          <ImageWall products={products} sizing={newArrivalsSizing} />
        </div>
      </section>

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
