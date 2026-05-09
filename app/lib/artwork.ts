export type Category = 'paintings' | 'drawings' | 'sculpture';
export type Series = 'botanical';

export type ArtworkImage = {
  src: string;
  alt: string;
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
  gradient?: string;
  sold?: boolean;
};

export const categories: { slug: Category; title: string; blurb: string }[] = [
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
  const file = (variant: 'Full' | 'Detail' | 'Framed') =>
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
    images: [
      { src: file('Framed'), alt: `Botanical No. ${n}, framed` },
      { src: file('Full'), alt: `Botanical No. ${n}, full view` },
      { src: file('Detail'), alt: `Botanical No. ${n}, detail` },
    ],
  };
});

const drawings: Artwork[] = Array.from({ length: 8 }, (_, i) => {
  const n = i + 1;
  const fileIndex = 12 + n;
  return {
    slug: `drawing-no-${n}`,
    title: `Drawing No. ${n}`,
    category: 'drawings',
    medium: 'Graphite on paper, framed',
    dimensions: '11" × 14"',
    year: 2025,
    price: 1400,
    images: [
      {
        src: `/images/artwork/drawings/${fileIndex}_orth_drawing_${n}.jpg`,
        alt: `Drawing No. ${n}`,
      },
    ],
  };
});

const placeholders: Artwork[] = [
  {
    slug: 'mushroom-cast-no-1',
    title: 'Mushroom Cast No. 1',
    category: 'sculpture',
    medium: 'Cast resin, hand-finished',
    dimensions: '8" wide × 4" tall',
    year: 2025,
    price: 950,
    gradient: 'from-yellow-100 via-orange-200 to-red-300',
  },
  {
    slug: 'mushroom-cast-no-2',
    title: 'Mushroom Cast No. 2',
    category: 'sculpture',
    medium: 'Cast bronze, patinated',
    dimensions: '8" wide × 4" tall',
    year: 2025,
    price: 1850,
    gradient: 'from-lime-100 via-green-200 to-emerald-300',
  },
  {
    slug: 'mushroom-cast-no-3',
    title: 'Mushroom Cast No. 3',
    category: 'sculpture',
    medium: 'Cast resin, hand-finished',
    dimensions: '8" wide × 4" tall',
    year: 2025,
    price: 950,
    gradient: 'from-cyan-100 via-blue-200 to-indigo-300',
  },
];

export const artworks: Artwork[] = [
  ...botanicals,
  ...drawings,
  ...placeholders,
];

export function getArtwork(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
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

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents);
}
