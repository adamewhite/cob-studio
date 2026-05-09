import Image from "next/image";

export const metadata = {
  title: "About",
  description:
    "Congress of Beauty is the studio of John Orth — original paintings, drawings, and cast sculpture.",
};

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-medium tracking-tight">
        Congress of Beauty
      </h1>
      <p className="mt-6 text-black/70">
        Congress of Beauty — COB — is the studio of John Orth. The studio
        produces original framed paintings and drawings, alongside small
        editions of cast tabletop sculpture.
      </p>
      <p className="mt-4 text-black/70">
        Every piece sold here is made by hand in the studio. Originals are
        one-of-one — once a piece is sold, it is gone.
      </p>

      <div className="relative mt-12 aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <Image
          src="/images/about_me.jpg"
          alt="John Orth in the studio"
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
      </div>

      <h2 className="mt-16 text-xl font-medium tracking-tight">The studio</h2>
      <p className="mt-4 text-black/70">
        Congress of Beauty keeps two outposts: one in the mountains of
        Western Maine and one in Brooklyn. Work moves between them with the
        seasons — quiet stretches at the Maine studio for painting and
        casting, and time in Brooklyn for finishing, framing, and shipping.
      </p>
    </div>
  );
}
