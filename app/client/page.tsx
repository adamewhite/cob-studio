import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { artworks } from '../lib/artwork';
import { withLiveSold } from '../lib/sold';
import { ImageWall, MONO_FONT, wallProducts } from './ImageWall';

// Layout mockup for the client: a brief, scrapbook-style landing page.
export const metadata: Metadata = {
  title: 'Layout option',
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default async function ClientLanding() {
  const products = wallProducts(await withLiveSold(artworks));

  return (
    <div
      className='relative min-h-dvh bg-white pb-16 text-[11px] leading-[18px] lowercase text-[#636363]'
      style={{ fontFamily: MONO_FONT }}
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


      <ImageWall products={products} className='px-5' />

      <footer className='mt-12 text-center'>
        congress of beauty · congressofbeauty.com
      </footer>
    </div>
  );
}
