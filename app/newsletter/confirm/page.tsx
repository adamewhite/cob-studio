import type { Metadata } from 'next';
import { ConfirmButton } from './ConfirmButton';

export const metadata: Metadata = {
  title: 'Confirm newsletter signup',
  robots: { index: false },
};

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await searchParams;
  const contactId = typeof id === 'string' ? id : '';

  return (
    <div className='mx-auto max-w-xl px-6 py-24 text-center'>
      <h1 className='text-3xl font-medium tracking-tight'>
        Confirm your signup
      </h1>
      <p className='mt-6 text-base leading-relaxed text-ink/70'>
        One click and you&rsquo;re on the Congress of Beauty list for news about
        new work.
      </p>
      <ConfirmButton contactId={contactId} />
    </div>
  );
}
