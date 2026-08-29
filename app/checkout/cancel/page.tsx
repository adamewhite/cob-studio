import Link from "next/link";
import { Accent } from "../../components/Accent";
import { ReopenCart } from "./ReopenCart";

export const metadata = {
  title: "Checkout cancelled",
};

export default function CheckoutCancel() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <Accent
        name="polypores"
        className="mx-auto mb-10 aspect-[4/5] w-40"
        sizes="160px"
      />
      <h1 className="text-balance text-3xl font-medium tracking-tight">
        No worries.
      </h1>
      <p className="mt-6 text-balance text-base leading-relaxed text-ink/70">
        Your cart is saved. Come back when you&apos;re ready.
      </p>
      <div className="mt-10 flex flex-col items-center gap-4">
        <ReopenCart />
        <Link
          href="/artwork"
          className="inline-block border-b border-ink/40 pb-1 text-base hover:border-ink"
        >
          Keep browsing
        </Link>
      </div>
    </div>
  );
}
