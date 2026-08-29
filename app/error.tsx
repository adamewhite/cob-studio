'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='mx-auto max-w-xl px-6 py-24 text-center'>
      <h1 className='text-3xl font-medium tracking-tight'>Something went wrong</h1>
      <p className='mt-6 text-base leading-relaxed text-ink/70'>
        An unexpected error stopped this page from loading. You can try again,
        or head back to the home page.
      </p>
      <div className='mt-10 flex justify-center gap-6 text-sm'>
        <button
          type='button'
          onClick={() => unstable_retry()}
          className='underline hover:text-ink'
        >
          Try again
        </button>
        <a href='/' className='underline hover:text-ink'>
          Home
        </a>
      </div>
    </div>
  );
}
