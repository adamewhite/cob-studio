'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArtworkMenu } from './ArtworkMenu';
import { CartTrigger } from './CartTrigger';
import { categories, seriesList } from '../lib/artwork';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const collapsed = scrolled && !hovered;

  return (
    <header
      className='relative z-40 h-32 sm:sticky sm:top-0 sm:h-16'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className='absolute inset-x-0 top-0 h-32 origin-top border-b border-black/10 bg-[#fcfbfa]/70 backdrop-blur will-change-transform sm:h-[8.4rem]'
        style={{
          transform: collapsed ? 'translateY(-4.4rem)' : 'translateY(0)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          className='mx-auto flex h-full max-w-7xl items-center justify-between px-6 will-change-transform'
          style={{
            transform: collapsed ? 'translateY(2.2rem)' : 'translateY(0)',
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Link
            href='/'
            aria-label='Congress of Beauty — home'
            className='block origin-left will-change-transform'
            style={{
              transform: collapsed ? 'scale(0.4375)' : 'scale(1)',
              transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Image
              src='/images/logo.png'
              alt='Congress of Beauty'
              width={608}
              height={762}
              priority
              className='h-24 w-auto sm:h-[7.2rem]'
            />
          </Link>

          <nav className='hidden items-center gap-8 text-lg sm:flex'>
            <ArtworkMenu />
            <Link
              href='/about'
              className='hover:opacity-60'
            >
              About
            </Link>
            <Link
              href='/contact'
              className='hover:opacity-60'
            >
              Contact
            </Link>
            <CartTrigger />
          </nav>

          <div className='flex items-center gap-4 sm:hidden'>
            <CartTrigger />
            <button
              type='button'
              aria-expanded={mobileOpen}
              aria-controls='mobile-nav-panel'
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className='-m-2 p-2'
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                aria-hidden
              >
                {mobileOpen ? (
                  <path
                    d='M6 6l12 12M18 6L6 18'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                ) : (
                  <path
                    d='M4 7h16M4 12h16M4 17h16'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            id='mobile-nav-panel'
            className='absolute inset-x-0 top-full border-b border-black/10 bg-[#fcfbfa] sm:hidden'
          >
            <nav className='mx-auto flex max-w-7xl flex-col px-6 py-4 text-lg'>
              <Link
                href='/artwork'
                onClick={() => setMobileOpen(false)}
                className='py-3 hover:opacity-60'
              >
                Artwork
              </Link>
              <div className='flex flex-col pl-4'>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/artwork/${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className='py-2 text-base text-black/70 hover:text-black'
                  >
                    {c.title}
                  </Link>
                ))}
                {seriesList.length > 0 && (
                  <>
                    <div className='mt-2 pb-1 text-xs uppercase tracking-wide text-black/40'>
                      Series
                    </div>
                    {seriesList.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/artwork/series/${s.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className='py-2 text-base text-black/70 hover:text-black'
                      >
                        {s.title}
                      </Link>
                    ))}
                  </>
                )}
              </div>
              <Link
                href='/about'
                onClick={() => setMobileOpen(false)}
                className='border-t border-black/10 py-3 hover:opacity-60'
              >
                About
              </Link>
              <Link
                href='/contact'
                onClick={() => setMobileOpen(false)}
                className='border-t border-black/10 py-3 hover:opacity-60'
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
