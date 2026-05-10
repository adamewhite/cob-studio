import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-black/10">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="text-base font-medium tracking-tight">
            Congress of Beauty
          </div>
          <p className="mt-3 max-w-xs text-base text-black/60">
            The studio of John Orth.
          </p>
        </div>

        <div>
          <div className="text-base font-medium">Shop</div>
          <ul className="mt-3 space-y-2 text-base text-black/60">
            <li>
              <Link href="/artwork/paintings" className="hover:text-black">
                Paintings
              </Link>
            </li>
            <li>
              <Link href="/artwork/drawings" className="hover:text-black">
                Drawings
              </Link>
            </li>
            <li>
              <Link href="/artwork/sculpture" className="hover:text-black">
                Sculpture
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-base font-medium">Studio</div>
          <ul className="mt-3 space-y-2 text-base text-black/60">
            <li>
              <Link href="/about" className="hover:text-black">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-black">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-base font-medium">Newsletter</div>
          <p className="mt-3 text-base text-black/60">
            Sign up for occasional updates on new work.
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-sm text-black/50 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Congress of Beauty</div>
          <div className="flex gap-4">
            <Link href="/policies/shipping" className="hover:text-black">
              Shipping
            </Link>
            <Link href="/policies/returns" className="hover:text-black">
              Returns
            </Link>
            <Link href="/policies/privacy" className="hover:text-black">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
