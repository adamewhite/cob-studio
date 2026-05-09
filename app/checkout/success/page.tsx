import Link from "next/link";
import { ClearCartOnMount } from "./ClearCartOnMount";

export const metadata = {
  title: "Thank you",
};

export default function CheckoutSuccess() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <ClearCartOnMount />
      <h1 className="text-3xl font-medium tracking-tight">Thank you.</h1>
      <p className="mt-6 text-base leading-relaxed text-black/70">
        Your order is confirmed. A receipt is on its way to your inbox.
        We&apos;ll be in touch shortly with shipping details.
      </p>
      <Link
        href="/artwork"
        className="mt-10 inline-block border-b border-black/40 pb-1 text-base hover:border-black"
      >
        Continue browsing
      </Link>
    </div>
  );
}
