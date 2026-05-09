import Image from "next/image";
import Link from "next/link";
import { categories, seriesList } from "../lib/artwork";
import { CartTrigger } from "./CartTrigger";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fcfbfa]/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" aria-label="Congress of Beauty — home" className="block">
          <Image
            src="/images/cob.svg"
            alt="Congress of Beauty"
            width={184}
            height={71}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-8 text-base">
          <div className="group relative">
            <Link href="/artwork" className="hover:opacity-60">
              Artwork
            </Link>
            <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="flex min-w-[14rem] flex-col gap-1 rounded-md border border-black/10 bg-white p-2 shadow-sm">
                <Link
                  href="/artwork"
                  className="rounded px-3 py-2 hover:bg-black/5"
                >
                  All work
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/artwork/${c.slug}`}
                    className="rounded px-3 py-2 hover:bg-black/5"
                  >
                    {c.title}
                  </Link>
                ))}
                {seriesList.length > 0 && (
                  <>
                    <div className="my-1 border-t border-black/10" />
                    <div className="px-3 pt-1 text-xs uppercase tracking-wide text-black/40">
                      Series
                    </div>
                    {seriesList.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/artwork/series/${s.slug}`}
                        className="rounded px-3 py-2 hover:bg-black/5"
                      >
                        {s.title}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          <Link href="/about" className="hover:opacity-60">
            About
          </Link>
          <CartTrigger />
        </nav>
      </div>
    </header>
  );
}
