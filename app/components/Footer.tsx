import Image from 'next/image';
import Link from 'next/link';
import { NewsletterForm } from './NewsletterForm';

export function Footer() {
  return (
    <footer className='mt-12 border-t border-ink/10 sm:mt-32'>
      <div className='mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 md:grid-cols-4'>
        <div>
          <Link
            href='/'
            aria-label='Congress of Beauty — home'
            className='group relative inline-block'
          >
            <Image
              src='/images/logo-with-text.svg'
              alt='Congress of Beauty'
              width={608}
              height={766}
              unoptimized
              className='h-[7.2rem] w-auto transition-opacity duration-150 group-hover:opacity-0 group-active:opacity-0'
            />
            <Image
              src='/images/logo-with-text-inverted.svg'
              alt=''
              aria-hidden
              width={608}
              height={766}
              unoptimized
              className='absolute inset-0 h-full w-full opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-active:opacity-100'
            />
          </Link>
          <p className='mt-3 max-w-xs text-base text-ink/60'>
            An art studio from Maine.
          </p>
        </div>

        <div>
          <div className='text-base font-medium'>Shop</div>
          <ul className='mt-3 space-y-2 text-base text-ink/60'>
            <li>
              <Link
                href='/artwork/paintings'
                className='hover:text-ink'
              >
                Paintings
              </Link>
            </li>
            <li>
              <Link
                href='/artwork/drawings'
                className='hover:text-ink'
              >
                Drawings
              </Link>
            </li>
            <li>
              <Link
                href='/artwork/sculpture'
                className='hover:text-ink'
              >
                Sculpture
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className='text-base font-medium'>Studio</div>
          <ul className='mt-3 space-y-2 text-base text-ink/60'>
            <li>
              <Link
                href='/about'
                className='hover:text-ink'
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href='/contact'
                className='hover:text-ink'
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className='text-base font-medium'>Newsletter</div>
          <p className='mt-3 text-base text-ink/60'>
            Sign up for occasional updates on new work.
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className='border-t border-ink/10'>
        <div className='mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-sm text-ink/50 sm:flex-row sm:items-center'>
          <div>© {new Date().getFullYear()} Congress of Beauty</div>
          <div className='flex gap-4'>
            <Link
              href='/policies/shipping'
              className='hover:text-ink'
            >
              Shipping
            </Link>
            <Link
              href='/policies/returns'
              className='hover:text-ink'
            >
              Returns
            </Link>
            <Link
              href='/policies/privacy'
              className='hover:text-ink'
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
