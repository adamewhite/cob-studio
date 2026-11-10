import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { accents, type AccentName } from '../lib/accents';
import {
  artworks,
  formatPrice,
  getThumbnail,
  type Artwork,
} from '../lib/artwork';
import { withLiveSold } from '../lib/sold';
import { ProductTile, type TileImage } from './ProductTile';

// Layout mockup for the client: a brief, scrapbook-style landing page.
// Images sit at their own widths and wrap into a ragged wall; product
// tiles carry three views that swap into the main image.
export const metadata: Metadata = {
  title: 'Layout option',
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

// Pixel sizes of the accent files, so each one keeps its own shape.
const accentPicks: { name: AccentName; w: number; h: number }[] = [
  { name: 'shellCreekWide', w: 1600, h: 900 },
  { name: 'sumac', w: 900, h: 1600 },
  { name: 'reishi', w: 1280, h: 1600 },
  { name: 'barnWindow', w: 900, h: 1600 },
  { name: 'applesNight', w: 1200, h: 1600 },
  { name: 'lichen', w: 1279, h: 1600 },
  { name: 'indianPipes', w: 2400, h: 3200 },
  { name: 'overlook', w: 1200, h: 1600 },
  { name: 'bolete', w: 1280, h: 1600 },
  { name: 'polyporeHostas', w: 900, h: 1600 },
  { name: 'mountainView', w: 2400, h: 3200 },
  { name: 'irisesBundled', w: 1280, h: 1600 },
  { name: 'boulder', w: 1200, h: 1600 },
  { name: 'rainyWindow', w: 2400, h: 3000 },
];

const productWidths = [460, 380, 520, 420];
const accentWidths = [300, 420, 260, 360, 480, 340, 280];

// Three views per piece. Drawings have two photos, so the grid crop
// fills the third spot.
function threeViews(a: Artwork): TileImage[] {
  const views = [...(a.images ?? [])];
  const thumb = getThumbnail(a);
  if (views.length < 3 && thumb) views.push(thumb);
  return views.slice(0, 3);
}

// Interleave so paintings and drawings alternate.
function mixProducts(list: Artwork[]): Artwork[] {
  const paintings = list.filter((a) => a.category === 'paintings');
  const others = list.filter((a) => a.category !== 'paintings');
  const out: Artwork[] = [];
  for (let i = 0; i < Math.max(paintings.length, others.length); i++) {
    if (paintings[i]) out.push(paintings[i]);
    if (others[i]) out.push(others[i]);
  }
  return out;
}

type Tile =
  | { kind: 'accent'; pick: (typeof accentPicks)[number]; width: number }
  | { kind: 'product'; artwork: Artwork; width: number; thumbs: 'under' | 'side' };

function buildTiles(products: Artwork[]): Tile[] {
  const tiles: Tile[] = [];
  let a = 0;
  products.forEach((artwork, i) => {
    tiles.push({
      kind: 'product',
      artwork,
      width: productWidths[i % productWidths.length],
      thumbs: i % 2 === 0 ? 'under' : 'side',
    });
    // One accent after most pieces, two after every third.
    const count = i % 3 === 2 ? 2 : 1;
    for (let k = 0; k < count && a < accentPicks.length; k++, a++) {
      tiles.push({
        kind: 'accent',
        pick: accentPicks[a],
        width: accentWidths[a % accentWidths.length],
      });
    }
  });
  return tiles;
}

export default async function ClientLanding() {
  const products = mixProducts(
    (await withLiveSold(artworks)).filter((a) => threeViews(a).length === 3),
  );
  const tiles = buildTiles(products);

  return (
    <div
      className='relative min-h-dvh bg-white pb-16 text-[11px] leading-[18px] lowercase text-[#636363]'
      style={{ fontFamily: "'Andale Mono', Monaco, Courier, monospace" }}
    >
      <nav className='absolute top-5 left-5 flex gap-4 text-black'>
        <Link href='/artwork' className='hover:underline'>
          shop
        </Link>
        <Link href='/about' className='hover:underline'>
          about
        </Link>
      </nav>
      <nav className='absolute top-5 right-5 text-black'>
        <Link href='/contact' className='hover:underline'>
          contact
        </Link>
      </nav>

      <header className='mx-auto flex flex-col items-center gap-3 px-5 pt-16 pb-10 text-center'>
        {/* Same logo and hover swap as the site nav. */}
        <Link
          href='/client'
          aria-label='Congress of Beauty'
          className='group relative block'
        >
          <Image
            src='/images/logo-with-text.svg'
            alt='Congress of Beauty'
            width={608}
            height={766}
            loading='eager'
            unoptimized
            className='h-32 w-auto transition-opacity duration-150 group-hover:opacity-0 sm:h-36'
          />
          <Image
            src='/images/logo-with-text-inverted.svg'
            alt=''
            aria-hidden
            width={608}
            height={766}
            loading='eager'
            unoptimized
            className='absolute inset-0 h-full w-full opacity-0 transition-opacity duration-150 group-hover:opacity-100'
          />
        </Link>
        <p>paintings, drawings and sculpture made by hand in maine</p>
      </header>

      <div className='flex flex-wrap items-start gap-2.5 px-5'>
        {tiles.map((t) =>
          t.kind === 'product' ? (
            <ProductTile
              key={t.artwork.slug}
              href={`/artwork/${t.artwork.category}/${t.artwork.slug}`}
              title={t.artwork.title}
              medium={t.artwork.medium}
              price={formatPrice(t.artwork.price)}
              sold={t.artwork.sold}
              images={threeViews(t.artwork)}
              width={t.width}
              thumbs={t.thumbs}
            />
          ) : (
            <Image
              key={t.pick.name}
              src={accents[t.pick.name].src}
              alt={accents[t.pick.name].alt}
              width={t.pick.w}
              height={t.pick.h}
              sizes={`(min-width: ${t.width + 40}px) ${t.width}px, 100vw`}
              className='h-auto max-w-full'
              style={{ width: t.width }}
            />
          ),
        )}
      </div>

      <footer className='mt-12 text-center'>
        congress of beauty · cob-studio.com
      </footer>
    </div>
  );
}
