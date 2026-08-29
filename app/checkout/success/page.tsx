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
        name="applesNight"
        className="mx-auto mb-10 aspect-[4/5] w-40"
        sizes="160px"
      />
      <h1 className="text-balance text-3xl font-medium tracking-tight">
        Thank you.
      </h1>
      <p className="mt-6 text-balance text-base leading-relaxed text-ink/70">
        Your order is confirmed. A receipt is on its way to your inbox.
      </p>
      <p className="mt-4 text-balance text-base leading-relaxed text-ink/70">
        We&apos;ll be in touch shortly with shipping details.
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
