import Link from 'next/link';

export const metadata = {
  title: 'Not found',
};

export default function NotFound() {
  return (
    <div className='mx-auto max-w-xl px-6 py-24 text-center'>
      <h1 className='text-3xl font-medium tracking-tight'>Page not found</h1>
      <p className='mt-6 text-base leading-relaxed text-black/70'>
        The page you&rsquo;re looking for doesn&rsquo;t exist, or the piece may
        have been sold and the link has moved on.
      </p>
      <div className='mt-10 flex justify-center gap-6 text-sm'>
        <Link href='/' className='underline hover:text-black'>
          Home
        </Link>
        <Link href='/artwork' className='underline hover:text-black'>
          Browse artwork
        </Link>
      </div>
    </div>
  );
}
