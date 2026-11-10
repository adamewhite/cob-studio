import type { Metadata } from 'next';
import { Instrument_Sans, Proza_Libre } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { CartDrawer } from './components/CartDrawer';
import { CartProvider } from './components/CartContext';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { SITE_ORIGIN } from './lib/site';
import { TopLoader } from './components/TopLoader';
import { SiteChrome } from './components/SiteChrome';

const instrumentSans = Instrument_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
});

const prozaLibre = Proza_Libre({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Congress of Beauty',
    template: '%s · Congress of Beauty',
  },
  description: 'Original paintings and drawings.',
  metadataBase: new URL(SITE_ORIGIN),
  openGraph: {
    type: 'website',
    siteName: 'Congress of Beauty',
    title: 'Congress of Beauty',
    description: 'Original paintings and drawings.',
    url: SITE_ORIGIN,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Congress of Beauty',
    description: 'Original paintings and drawings.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${instrumentSans.variable} ${prozaLibre.variable} antialiased`}
    >
      <body className='flex min-h-dvh flex-col text-ink'>
        <TopLoader />
        <CartProvider>
          <SiteChrome>
            <div
              role='region'
              aria-label='Announcement'
              className='bg-pine text-bright'
            >
              <div className='mx-auto max-w-7xl px-6 py-2 text-center text-sm'>
                FREE shipping on U.S. orders.
              </div>
            </div>
            <Nav />
          </SiteChrome>
          <main className='flex-1'>{children}</main>
          <SiteChrome>
            <Footer />
          </SiteChrome>
          <CartDrawer />
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
