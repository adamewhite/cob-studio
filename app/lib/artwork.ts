export type Category = 'paintings' | 'drawings' | 'sculpture';
export type Series = 'botanical';

export type ArtworkImage = {
  src: string;
  alt: string;
  // CSS object-position for cropped displays, e.g. 'center bottom'.
  position?: string;
};

export type Artwork = {
  slug: string;
  title: string;
  category: Category;
  series?: Series;
  medium: string;
  dimensions: string;
  framedDimensions?: string;
  year: number;
  price: number;
  description?: string;
  images?: ArtworkImage[];
  // Uniformly composed grid crop from scripts/make-thumbnails.mjs.
  thumbnail?: ArtworkImage;
  gradient?: string;
  sold?: boolean;
  // Reachable by direct link and purchasable, but left out of listings,
  // the sitemap, and search indexing. Used for checkout test items.
  hidden?: boolean;
};

export const categories: {
  slug: Category;
  title: string;
  blurb: string;
  cover?: ArtworkImage;
}[] = [
  {
    slug: 'paintings',
    title: 'Paintings',
    blurb: 'Original framed paintings from the Congress of Beauty studio.',
  },
  {
    slug: 'drawings',
    title: 'Drawings',
    blurb: 'Original framed drawings on paper.',
  },
  {
    slug: 'sculpture',
    title: 'Sculpture',
    blurb: 'Cast tabletop sculpture, including the mushroom series.',
    cover: {
      src: `/images/artwork/sculpture/${encodeURIComponent(
        'Sculpture - Shells - Shelf.jpg',
      )}`,
      alt: 'Cast shell sculpture on a shelf beside a potted jade plant',
      position: 'center bottom',
    },
  },
];

export const seriesList: { slug: Series; title: string; blurb: string }[] = [
  {
    slug: 'botanical',
    title: 'Botanical',
    blurb:
      'An ongoing series of small botanical paintings, each framed and one of one.',
  },
];

const botanicals: Artwork[] = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  const padded = String(n).padStart(2, '0');
  const file = (variant: 'Full' | 'Detail' | 'Shelf' | 'Thumb') =>
    `/images/artwork/botanical/${encodeURIComponent(
      `Botanical Painting - ${padded} - ${variant}.jpg`,
    )}`;
  return {
    slug: `botanical-no-${n}`,
    title: `Botanical No. ${n}`,
    category: 'paintings',
    series: 'botanical',
    medium: 'Painting on paper, framed',
    dimensions: '11" × 17"',
    framedDimensions: '12" × 18"',
    year: 2025,
    price: 325,
    thumbnail: { src: file('Thumb'), alt: `Botanical No. ${n}, framed` },
    images: [
      { src: file('Shelf'), alt: `Botanical No. ${n}, framed on a shelf` },
      { src: file('Full'), alt: `Botanical No. ${n}, full view` },
      { src: file('Detail'), alt: `Botanical No. ${n}, detail` },
    ],
  };
});

// Drawing 19 has no detail shot yet.
const drawingsWithoutDetail = new Set([19]);

const drawings: Artwork[] = Array.from({ length: 19 }, (_, i) => {
  const n = i + 1;
  const padded = String(n).padStart(2, '0');
  const file = (suffix: string) =>
    `/images/artwork/drawings/${encodeURIComponent(
      `Drawing - ${padded}${suffix}.jpg`,
    )}`;
  return {
    slug: `drawing-no-${n}`,
    title: `Drawing No. ${n}`,
    category: 'drawings',
    medium: 'Graphite on paper, framed',
    dimensions: '11" × 14"',
    year: 2025,
    price: 225,
    thumbnail: { src: file(' - Thumb'), alt: `Drawing No. ${n}` },
    images: [
      { src: file(''), alt: `Drawing No. ${n}` },
      ...(drawingsWithoutDetail.has(n)
        ? []
        : [{ src: file(' - Detail'), alt: `Drawing No. ${n}, detail` }]),
    ],
  };
});

const sculptureFile = (name: string) =>
  `/images/artwork/sculpture/${encodeURIComponent(`Sculpture - ${name}.jpg`)}`;

// TODO: confirm medium, dimensions, and price with John.
const sculptures: Artwork[] = [
  {
    slug: 'shells',
    title: 'Shells',
    category: 'sculpture',
    medium: 'Cast resin, hand-finished',
    dimensions: '8" wide × 4" tall',
    year: 2025,
    price: 275,
    images: [
      { src: sculptureFile('Shells'), alt: 'Pair of cast pink shells' },
      {
        src: sculptureFile('Shells - Shelf'),
        alt: 'Cast shells on a shelf beside a potted jade plant',
      },
    ],
  },
];

// Hidden $0.50 item for testing live checkout end to end. Stripe's minimum
// charge is $0.50. Visit /artwork/sculpture/payment-test to buy it.
const testItems: Artwork[] = [
  {
    slug: 'payment-test',
    title: 'Payment Test',
    category: 'sculpture',
    medium: 'Checkout test item, not a real artwork',
    dimensions: 'N/A',
    year: 2026,
    price: 0.5,
    gradient: 'from-stone-100 via-stone-200 to-stone-300',
    hidden: true,
  },
];

const allArtworks: Artwork[] = [
  ...botanicals,
  ...drawings,
  ...sculptures,
  ...testItems,
];

export const artworks: Artwork[] = allArtworks.filter((a) => !a.hidden);

export function getArtwork(slug: string): Artwork | undefined {
  return allArtworks.find((a) => a.slug === slug);
}

export function getArtworksByCategory(category: Category): Artwork[] {
  return artworks.filter((a) => a.category === category);
}

export function getArtworksBySeries(series: Series): Artwork[] {
  return artworks.filter((a) => a.series === series);
}

export function getCoverImage(artwork: Artwork): ArtworkImage | undefined {
  return artwork.images?.[0];
}

export function getThumbnail(artwork: Artwork): ArtworkImage | undefined {
  return artwork.thumbnail ?? getCoverImage(artwork);
}

export function formatPrice(dollars: number): string {
  // Whole-dollar prices show no cents; sub-dollar test prices need them.
  const digits = Number.isInteger(dollars) ? 0 : 2;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(dollars);
}
