export const metadata = {
  title: 'Returns',
  description:
    'How returns work for original artwork from Congress of Beauty.',
};

export default function Returns() {
  return (
    <div className='mx-auto max-w-3xl px-6 py-20'>
      <h1 className='text-3xl font-medium tracking-tight'>Returns</h1>

      <p className='mt-8 text-black/70'>
        We want you to live with work that you love. If a piece
        isn&apos;t right for your space, you can return it within 14 days
        of delivery for a refund.
      </p>

      <h2 className='mt-12 text-xl font-medium tracking-tight'>
        How to return a piece
      </h2>
      <p className='mt-3 text-black/70'>
        Email us within 14 days of delivery to let us know you&apos;d
        like to return the piece. We&apos;ll send return instructions
        and the address to ship to.
      </p>

      <h2 className='mt-10 text-xl font-medium tracking-tight'>Condition</h2>
      <p className='mt-3 text-black/70'>
        The piece must come back in its original condition, in the
        original packaging. Original art is fragile — please pack it
        with the same care you&apos;d expect to receive it in.
      </p>

      <h2 className='mt-10 text-xl font-medium tracking-tight'>
        Shipping and refunds
      </h2>
      <p className='mt-3 text-black/70'>
        Return shipping is the buyer&apos;s responsibility. We recommend
        a carrier with tracking and insurance for the full value of the
        piece. Once the work arrives back to the studio in its original
        condition, we&apos;ll refund the purchase price (original
        shipping is not refunded) to the original payment method within
        5 business days.
      </p>

      <h2 className='mt-10 text-xl font-medium tracking-tight'>
        Damaged in transit
      </h2>
      <p className='mt-3 text-black/70'>
        If a piece arrived damaged, that&apos;s handled separately —
        see our{' '}
        <a
          href='/policies/shipping'
          className='underline hover:text-black'
        >
          shipping policy
        </a>
        . You don&apos;t need to follow the return process above.
      </p>

      <p className='mt-12 text-black/70'>
        Questions about a return? Get in touch — we&apos;re happy to
        help.
      </p>
    </div>
  );
}
