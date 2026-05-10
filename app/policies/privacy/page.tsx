export const metadata = {
  title: 'Privacy',
  description:
    'How Congress of Beauty collects, uses, and protects your information.',
};

export default function Privacy() {
  return (
    <div className='mx-auto max-w-3xl px-6 py-20'>
      <h1 className='text-3xl font-medium tracking-tight'>Privacy</h1>
      <p className='mt-2 text-sm text-black/50'>Last updated: May 10, 2026</p>

      <p className='mt-8 text-black/70'>
        Congress of Beauty (&quot;we&quot;, &quot;us&quot;) is a small art
        studio. This policy explains what we collect when you visit
        cob-studio.com or buy a piece, what we do with it, and the
        choices you have. We try to keep this short and plain because
        the practices behind it are short and plain.
      </p>

      <h2 className='mt-12 text-xl font-medium tracking-tight'>
        What we collect
      </h2>
      <p className='mt-3 text-black/70'>
        We collect only what we need to run the studio and ship your
        work to you:
      </p>
      <ul className='mt-3 list-disc space-y-2 pl-6 text-black/70'>
        <li>
          <span className='font-medium text-black/80'>Orders.</span>{' '}
          Your name, email, shipping address, and a record of what you
          bought. Payment details (card number, billing address) are
          collected and processed by Stripe — we never see or store
          your card number.
        </li>
        <li>
          <span className='font-medium text-black/80'>Newsletter.</span>{' '}
          If you sign up, we store your email address with Resend so we
          can send you occasional studio updates.
        </li>
        <li>
          <span className='font-medium text-black/80'>
            Messages you send us.
          </span>{' '}
          If you email us, we keep the email so we can reply and keep a
          record of the conversation.
        </li>
        <li>
          <span className='font-medium text-black/80'>
            Anonymous usage data.
          </span>{' '}
          We use Vercel Web Analytics to understand which pages are
          visited and how the site performs. It records anonymous,
          aggregated information about page views and device type. It
          does not use cookies, does not track you across other
          websites, and does not identify you personally.
        </li>
      </ul>
      <p className='mt-3 text-black/70'>
        We do not run advertising trackers or third-party marketing
        cookies on this site.
      </p>

      <h2 className='mt-10 text-xl font-medium tracking-tight'>
        How we use it
      </h2>
      <ul className='mt-3 list-disc space-y-2 pl-6 text-black/70'>
        <li>To process your order and ship the work to you.</li>
        <li>
          To send you transactional emails about your order (order
          confirmation, shipping notification).
        </li>
        <li>
          To send you the newsletter, if you signed up for it. You can
          unsubscribe at any time from a link in every newsletter
          email.
        </li>
        <li>To reply to you if you contact us.</li>
        <li>
          To keep business records as required by tax and other laws.
        </li>
      </ul>

      <h2 className='mt-10 text-xl font-medium tracking-tight'>
        Who we share it with
      </h2>
      <p className='mt-3 text-black/70'>
        We don&apos;t sell your information to anyone. We share it only
        with the services we use to run the studio:
      </p>
      <ul className='mt-3 list-disc space-y-2 pl-6 text-black/70'>
        <li>
          <span className='font-medium text-black/80'>Stripe</span> —
          processes payments. Subject to{' '}
          <a
            href='https://stripe.com/privacy'
            className='underline hover:text-black'
          >
            Stripe&apos;s privacy policy
          </a>
          .
        </li>
        <li>
          <span className='font-medium text-black/80'>Resend</span> —
          sends transactional and newsletter emails. Subject to{' '}
          <a
            href='https://resend.com/legal/privacy-policy'
            className='underline hover:text-black'
          >
            Resend&apos;s privacy policy
          </a>
          .
        </li>
        <li>
          <span className='font-medium text-black/80'>Vercel</span> —
          hosts the website and provides Web Analytics. Subject to{' '}
          <a
            href='https://vercel.com/legal/privacy-policy'
            className='underline hover:text-black'
          >
            Vercel&apos;s privacy policy
          </a>
          .
        </li>
        <li>
          <span className='font-medium text-black/80'>USPS</span> —
          delivers your order. We share the shipping address and your
          name.
        </li>
      </ul>
      <p className='mt-3 text-black/70'>
        We may also disclose information if required by law (a
        subpoena, court order, or similar legal process).
      </p>

      <h2 className='mt-10 text-xl font-medium tracking-tight'>
        Your choices
      </h2>
      <p className='mt-3 text-black/70'>
        You can:
      </p>
      <ul className='mt-3 list-disc space-y-2 pl-6 text-black/70'>
        <li>
          Unsubscribe from the newsletter at any time using the link in
          any newsletter email.
        </li>
        <li>
          Ask us what information we have about you, ask us to correct
          it, or ask us to delete it. Email us at{' '}
          <a
            href='mailto:sales@cob-studio.com'
            className='underline hover:text-black'
          >
            sales@cob-studio.com
          </a>
          {' '}and we&apos;ll respond within a reasonable time. Note that
          some information (order records, tax records) we&apos;re
          required to keep by law and can&apos;t fully delete on
          request.
        </li>
      </ul>

      <h2 className='mt-10 text-xl font-medium tracking-tight'>
        How long we keep it
      </h2>
      <p className='mt-3 text-black/70'>
        We keep order records as long as required for tax and business
        purposes (generally 7 years in the US). We keep newsletter
        subscribers until you unsubscribe.
      </p>

      <h2 className='mt-10 text-xl font-medium tracking-tight'>Children</h2>
      <p className='mt-3 text-black/70'>
        The site is intended for adults. We don&apos;t knowingly
        collect information from anyone under 13. If you believe a
        child has given us information, contact us and we&apos;ll
        delete it.
      </p>

      <h2 className='mt-10 text-xl font-medium tracking-tight'>
        Changes to this policy
      </h2>
      <p className='mt-3 text-black/70'>
        If our practices change, we&apos;ll update this page and the
        &quot;Last updated&quot; date at the top. Material changes will
        be flagged here.
      </p>

      <h2 className='mt-10 text-xl font-medium tracking-tight'>Contact</h2>
      <p className='mt-3 text-black/70'>
        Questions about privacy or your information? Email{' '}
        <a
          href='mailto:sales@cob-studio.com'
          className='underline hover:text-black'
        >
          sales@cob-studio.com
        </a>
        .
      </p>
    </div>
  );
}
