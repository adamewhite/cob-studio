import Link from "next/link";
import { Accent } from "../../components/Accent";
import { ClearCartOnMount } from "./ClearCartOnMount";

export const metadata = {
  title: "Thank you",
};

export default function CheckoutSuccess() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <ClearCartOnMount />
      <Accent
        name="irisesBundled"
        className="mx-auto mb-12 aspect-[4/5] w-full max-w-md"
        sizes="(min-width: 512px) 448px, 100vw"
      />
      <h1 className="text-balance text-3xl font-medium tracking-tight">
        Thank you.
      </h1>
      <p className="mt-6 text-balance text-base leading-relaxed text-ink/70">
        Your order is confirmed. A receipt and order confirmation are on their
        way to your inbox.
      </p>
      <p className="mt-4 text-balance text-base leading-relaxed text-ink/70">
        Your piece ships within a week.
      </p>
      <Link
        href="/artwork"
        className="mt-10 inline-block border-b border-ink/40 pb-1 text-base hover:border-ink"
      >
        Continue browsing
      </Link>
    </div>
  );
}
