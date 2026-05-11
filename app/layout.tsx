import type { Metadata } from 'next';
import { Instrument_Sans, Proza_Libre } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { CartDrawer } from './components/CartDrawer';
import { CartProvider } from './components/CartContext';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

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
    default: 'COB STUDIO',
    template: '%s · Congress of Beauty',
  },
  description: 'Original paintings, drawings, and cast sculpture.',
  metadataBase: new URL('https://www.cob-studio.com'),
  openGraph: {
    type: 'website',
    siteName: 'COB STUDIO',
    title: 'COB STUDIO',
    description: 'Original paintings, drawings, and cast sculpture.',
    url: 'https://www.cob-studio.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'COB STUDIO',
    description: 'Original paintings, drawings, and cast sculpture.',
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
      <body className='flex min-h-dvh flex-col text-black'>
        <CartProvider>
          <div
            role='region'
            aria-label='Announcement'
            style={{ backgroundColor: 'rgb(42, 65, 42)' }}
            className='text-white'
          >
            <div className='mx-auto max-w-7xl px-6 py-2 text-center text-sm'>
              FREE shipping on U.S. orders.
            </div>
          </div>
          <Nav />
          <main className='flex-1'>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
