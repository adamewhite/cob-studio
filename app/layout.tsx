import type { Metadata } from "next";
import { Instrument_Sans, Proza_Libre } from "next/font/google";
import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const prozaLibre = Proza_Libre({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Congress of Beauty — John Orth",
    template: "%s · Congress of Beauty",
  },
  description:
    "The studio of John Orth. Original paintings, drawings, and cast sculpture.",
  metadataBase: new URL("https://www.cob-studio.com"),
  openGraph: {
    type: "website",
    siteName: "Congress of Beauty",
    title: "Congress of Beauty — John Orth",
    description:
      "The studio of John Orth. Original paintings, drawings, and cast sculpture.",
    url: "https://www.cob-studio.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Congress of Beauty — John Orth",
    description:
      "The studio of John Orth. Original paintings, drawings, and cast sculpture.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${prozaLibre.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-black">
        <div
          role="region"
          aria-label="Announcement"
          style={{ backgroundColor: "rgb(42, 65, 42)" }}
          className="text-white"
        >
          <div className="mx-auto max-w-7xl px-6 py-2 text-center text-sm">
            FREE shipping on U.S. orders.
          </div>
        </div>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
