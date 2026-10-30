'use client';

import Link from 'next/link';
import { useState } from 'react';
import { confirmSubscription } from '../../lib/newsletter';

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

// Confirming takes a click rather than happening on page load, so email
// security scanners that open links can't subscribe someone by accident.
export function ConfirmButton({ contactId }: { contactId: string }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function confirm() {
    setStatus({ kind: 'submitting' });
    const result = await confirmSubscription(contactId);
    setStatus(
      result.ok
        ? { kind: 'success' }
        : { kind: 'error', message: result.error },
    );
  }

  if (status.kind === 'success') {
    return (
      <div className='mt-10'>
        <p className='text-base text-ink/70'>
          You&rsquo;re on the list. Thank you!
        </p>
        <Link
          href='/artwork'
          className='mt-6 inline-block text-sm underline hover:text-ink'
        >
          Browse artwork
        </Link>
      </div>
    );
  }

  return (
    <div className='mt-10'>
      <button
        type='button'
        onClick={confirm}
        disabled={status.kind === 'submitting'}
        className='bg-pine px-6 py-3.5 text-base text-bright hover:bg-pine/80 disabled:cursor-not-allowed disabled:bg-pine/30'
      >
        {status.kind === 'submitting' ? 'Confirming…' : 'Confirm signup'}
      </button>
      {status.kind === 'error' && (
        <p className='mt-4 text-sm text-red-700' role='alert'>
          {status.message}
        </p>
      )}
    </div>
  );
}
