import Image from "next/image";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Congress of Beauty — original paintings, drawings, and cast sculpture by John Orth.",
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-10 md:grid-cols-5 md:items-center md:gap-12">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 md:col-span-3">
          <Image
            src="/images/contact_image.jpg"
            alt="Congress of Beauty studio"
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-medium tracking-tight">Contact</h1>

          <p className="mt-6 text-black/70">
            For questions about a piece, a commission, or anything else, email{" "}
            <a
              href="mailto:hello@cob-studio.com"
              className="underline hover:text-black"
            >
              hello@cob-studio.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
