import { accents, type AccentName } from '../lib/accents';
import { formatPrice, getThumbnail, type Artwork } from '../lib/artwork';
import { FadeImage } from '../components/FadeImage';
import { ProductTile, type TileImage } from './ProductTile';

// The Brief-style image wall shared by /client and /test: images sit at
// their own widths and wrap into a ragged wall, and product tiles carry
// three views that swap into the main image.

export const MONO_FONT = "'Andale Mono', Monaco, Courier, monospace";

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

// Tile widths in px, used in turn, and how many accents follow each piece.
export type WallSizing = {
  productWidths: number[];
  accentWidths: number[];
  accentsAfter: (pieceIndex: number) => number;
  // Gap and row alignment classes for the flex container.
  layoutClassName: string;
  // Where each tile sits in its row's height, used in turn across all
  // tiles. Leave out to top-align everything.
  tileAlign?: ('start' | 'center' | 'end')[];
  // True to place a piece's accent photos before it instead of after.
  accentsFirst?: (pieceIndex: number) => boolean;
  // Which accent photos to show, in order. Leave out for the full set.
  accentNames?: AccentName[];
};

// The /client density: one accent after most pieces, two after every third.
const defaultSizing: WallSizing = {
  productWidths: [460, 380, 520, 420],
  accentWidths: [300, 420, 260, 360, 480, 340, 280],
  accentsAfter: (i) => (i % 3 === 2 ? 2 : 1),
  layoutClassName: 'gap-2.5',
};

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
  | {
      kind: 'product';
      artwork: Artwork;
      width: number;
      thumbs: 'under' | 'side';
    };

function buildTiles(products: Artwork[], sizing: WallSizing): Tile[] {
  const { productWidths, accentWidths, accentsAfter } = sizing;
  const picks = sizing.accentNames
    ? sizing.accentNames.flatMap((n) => accentPicks.filter((p) => p.name === n))
    : accentPicks;
  const tiles: Tile[] = [];
  let a = 0;
  products.forEach((artwork, i) => {
    const piece: Tile = {
      kind: 'product',
      artwork,
      width: productWidths[i % productWidths.length],
      thumbs: i % 2 === 0 ? 'under' : 'side',
    };
    const photos: Tile[] = [];
    const count = accentsAfter(i);
    for (let k = 0; k < count && a < picks.length; k++, a++) {
      photos.push({
        kind: 'accent',
        pick: picks[a],
        width: accentWidths[a % accentWidths.length],
      });
    }
    if (sizing.accentsFirst?.(i)) tiles.push(...photos, piece);
    else tiles.push(piece, ...photos);
  });
  return tiles;
}

// Pieces with three views, paintings and drawings alternating.
export function wallProducts(list: Artwork[]): Artwork[] {
  return mixProducts(list.filter((a) => threeViews(a).length === 3));
}

export function ImageWall({
  products,
  className = '',
  sizing = defaultSizing,
}: {
  products: Artwork[];
  className?: string;
  sizing?: WallSizing;
}) {
  const tiles = buildTiles(products, sizing);
  return (
    <div
      className={`flex flex-wrap items-start ${sizing.layoutClassName} ${className}`}
    >
      {tiles.map((t, i) => {
        const alignSelf = sizing.tileAlign?.[i % sizing.tileAlign.length];
        return t.kind === 'product' ? (
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
            alignSelf={alignSelf}
          />
        ) : (
          <FadeImage
            key={t.pick.name}
            src={accents[t.pick.name].src}
            alt={accents[t.pick.name].alt}
            width={t.pick.w}
            height={t.pick.h}
            sizes={`(min-width: ${t.width + 40}px) ${t.width}px, 100vw`}
            className='h-auto max-w-full'
            style={{ width: t.width, alignSelf }}
          />
        );
      })}
    </div>
  );
}
