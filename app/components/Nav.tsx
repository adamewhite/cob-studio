import Image from "next/image";
import Link from "next/link";
import { ArtworkMenu } from "./ArtworkMenu";
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
          <ArtworkMenu />
          <Link href="/about" className="hover:opacity-60">
            About
          </Link>
          <CartTrigger />
        </nav>
      </div>
    </header>
  );
}
