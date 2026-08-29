export type AccentName =
  | "sumac"
  | "reishi"
  | "puffball"
  | "bolete"
  | "polypores"
  | "polyporeBench"
  | "polyporeLog"
  | "shellCreekGold"
  | "shellCreekDark"
  | "shellCreekWide"
  | "shellDeck"
  | "lichen"
  | "lichenClose"
  | "applesField"
  | "applesNight"
  | "irisesWrapped"
  | "overlook";

export const accents: Record<AccentName, { src: string; alt: string }> = {
  sumac: {
    src: "/images/accents/accent-1243.jpg",
    alt: "Two staghorn sumac buds laid on pale stone",
  },
  reishi: {
    src: "/images/accents/accent-1404.jpg",
    alt: "A glossy red reishi mushroom growing from a fallen log",
  },
  puffball: {
    src: "/images/accents/accent-0180.jpg",
    alt: "An opened puffball mushroom on a mossy bank",
  },
  bolete: {
    src: "/images/accents/accent-2158.jpg",
    alt: "A red-capped bolete laid on a scratched blue worktable",
  },
  polypores: {
    src: "/images/accents/accent-2547.jpg",
    alt: "Cast polypore sculpture on a concrete ledge above hostas",
  },
  polyporeBench: {
    src: "/images/accents/accent-2549.jpg",
    alt: "Cast mushroom sculpture standing on a concrete bench",
  },
  polyporeLog: {
    src: "/images/accents/accent-2552.jpg",
    alt: "Cast mushroom sculpture set on a split log in the woodshed",
  },
  shellCreekGold: {
    src: "/images/accents/accent-2579.jpg",
    alt: "Cast shell sculpture resting in a creek in golden light",
  },
  shellCreekDark: {
    src: "/images/accents/accent-2613.jpg",
    alt: "Cast shell sculpture in dark moving water",
  },
  shellCreekWide: {
    src: "/images/accents/accent-2613-wide.jpg",
    alt: "Cast shell sculpture in dark moving water, turned on its side",
  },
  shellDeck: {
    src: "/images/accents/accent-2627.jpg",
    alt: "Cast shell sculpture in pink and blue on weathered green boards",
  },
  lichen: {
    src: "/images/accents/accent-9145.jpg",
    alt: "A branch of pale lichen against deep green moss",
  },
  lichenClose: {
    src: "/images/accents/accent-9145b.jpg",
    alt: "Pale lichen and moss in close detail",
  },
  applesField: {
    src: "/images/accents/accent-1891.jpg",
    alt: "A wheelbarrow of wild apples at the edge of the field",
  },
  applesNight: {
    src: "/images/accents/accent-2011.jpg",
    alt: "Apples gathered in a wheelbarrow, lit at night",
  },
  irisesWrapped: {
    src: "/images/accents/accent-9386b.jpg",
    alt: "Iris divisions wrapped in newspaper on the studio table",
  },
  overlook: {
    src: "/images/accents/accent-8619.jpg",
    alt: "The studio dog looking over the river valley from a granite ledge",
  },
};
