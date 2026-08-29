import Link from "next/link";
import { Accent } from "../../components/Accent";

export const metadata = {
  title: "Shipping",
  description: "How Congress of Beauty ships original artwork to collectors.",
};

export default function Shipping() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-10 sm:pt-28">
      <h1 className="text-3xl font-medium tracking-tight">Shipping</h1>

      <p className="mt-8 text-black/70">
        Every piece is packed by hand in the studio. Originals are one-of-one,
        so we take care to get them to you safely.
      </p>

      <Accent
        name="irisesWrapped"
        className="mt-8 aspect-[16/9] w-full"
        sizes="(min-width: 768px) 720px, 100vw"
      />

      <h2 className="mt-12 text-xl font-medium tracking-tight">
        Where we ship
      </h2>
      <p className="mt-3 text-black/70">
        We currently ship within the United States only. If you&apos;re outside
        the US and interested in a piece, please reach out and we&apos;ll do our
        best to work something out.
      </p>

      <h2 className="mt-10 text-xl font-medium tracking-tight">When we ship</h2>
      <p className="mt-3 text-black/70">
        Orders ship within 3–5 business days of purchase. You&apos;ll receive a
        tracking number by email as soon as the package is on its way.
      </p>

      <h2 className="mt-10 text-xl font-medium tracking-tight">How we ship</h2>
      <p className="mt-3 text-black/70">
        We ship via USPS with tracking included on every order. Paintings and
        drawings are shipped flat or rolled depending on size. Framed work and
        sculpture are packed with extra protection appropriate to the piece.
      </p>

      <h2 className="mt-10 text-xl font-medium tracking-tight">
        Damage in transit
      </h2>
      <p className="mt-3 text-black/70">
        If a piece arrives damaged, email us within 7 days of delivery with
        photos of the damage and the packaging. We&apos;ll work with you on a
        replacement, repair, or refund depending on the piece and the situation.
      </p>

      <p className="mt-12 text-black/70">
        Questions about a specific piece or shipping situation?{" "}
        <Link href="/contact" className="underline hover:text-black">
          Get in touch
        </Link>{" "}
        — we&apos;re happy to help.
      </p>
    </div>
  );
}
