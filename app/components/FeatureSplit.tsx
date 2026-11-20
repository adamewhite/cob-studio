import Link from 'next/link';
import { formatPrice, getThumbnail, type Artwork } from '../lib/artwork';
import { FadeImage } from './FadeImage';

// Sections styled after whatsupton.com, shared by the home page and /test.

// whatsupton.com product tile: tall photo, title in the display face.
export function PieceCard({
  artwork,
  sizes,
  small = false,
}: {
  artwork: Artwork;
  sizes: string;
  small?: boolean;
}) {
  const cover = getThumbnail(artwork);
  return (
    <Link
      href={`/artwork/${artwork.category}/${artwork.slug}`}
      className='group block'
    >
      <div className='relative aspect-[4/5] w-full overflow-hidden bg-veil'>
        {cover && (
          <FadeImage
            src={cover.src}
            alt={cover.alt}
            fill
            sizes={sizes}
            className='object-cover group-hover:opacity-90'
          />
        )}
      </div>
      <div
        className={`mt-3 font-display tracking-[0.6px] text-[#1a1a1a] ${
          small ? 'text-base leading-5' : 'text-xl leading-[25px]'
        }`}
      >
        {artwork.title}
      </div>
      <div className='mt-1 text-sm tracking-[0.6px] text-[#1a1a1a]/70'>
        {artwork.sold ? 'Sold' : formatPrice(artwork.price)}
      </div>
    </Link>
  );
}

// whatsupton.com split feature: label, heading, copy, a View All link and
// two pieces on one side; one large accent photo on the other, linking to
// the same place as View All. `flip` puts the large photo on the left.
export function Feature({
  eyebrow,
  title,
  body,
  href,
  pieces,
  large,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  pieces: Artwork[];
  large: { src: string; alt: string };
  flip?: boolean;
}) {
  return (
    <section className='px-6 py-16 sm:px-8 sm:py-24'>
      <div className='mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-2 md:gap-x-[8%]'>
        <div className={flip ? 'md:order-2' : ''}>
          <h3 className='text-xs uppercase leading-[18px] tracking-[0.6px] text-[#1a1a1a]/70'>
            {eyebrow}
          </h3>
          <h2 className='mt-3 font-display text-[36px] leading-[45px] tracking-[0.6px] text-[#1a1a1a]'>
            {title}
          </h2>
          <p className='mt-4 max-w-xl text-sm leading-[21px] tracking-[0.6px] text-[#1a1a1a]/75'>
            {body}
          </p>
          <Link
            href={href}
            className='mt-6 inline-block border-b border-[#1a1a1a] pb-2 text-sm tracking-[0.6px] text-[#1a1a1a] hover:opacity-60'
          >
            View All
          </Link>
          <div className='mt-6 grid grid-cols-2 gap-6'>
            {pieces.map((a) => (
              <PieceCard
                key={a.slug}
                artwork={a}
                small
                sizes='(min-width: 768px) 20vw, 50vw'
              />
            ))}
          </div>
        </div>
        {
          <Link
            href={href}
            className={`group relative block aspect-[3/4] w-full overflow-hidden bg-veil ${
              flip ? 'md:order-1' : ''
            }`}
          >
            <FadeImage
              src={large.src}
              alt={large.alt}
              fill
              sizes='(min-width: 768px) 45vw, 100vw'
              className='object-cover group-hover:opacity-90'
            />
          </Link>
        }
      </div>
    </section>
  );
}
