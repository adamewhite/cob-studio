import { Accent } from "../components/Accent";

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
        COB is a studio based in Maine in many senses.
      </p>
      <p className="mt-6 text-black/70">
        Maine&apos;s natural beauty is a constant source of inspiration and the
        studio&apos;s work is deeply rooted in the experience of making and
        living there.
      </p>
      <Accent
        name="overlook"
        className="mt-10 aspect-[16/9] w-full"
        sizes="(min-width: 768px) 720px, 100vw"
        positionClass="object-[50%_85%]"
      />
      <p className="mt-10 text-black/70">
        The rhythms of the seasons, the flora and fauna, and the quality of
        light all find their way into the paintings, drawings, and sculpture
        produced by the studio.
      </p>
      <p className="mt-10 text-black/70">
        The studio produces original framed paintings and drawings, alongside
        small editions of cast tabletop sculpture.
      </p>
      <p className="mt-4 text-black/70">
        Every piece sold here is made by hand in the studio. Originals are
        one-of-one — once a piece is sold, it is gone.
      </p>
      <Accent
        name="applesField"
        className="mt-10 aspect-[16/9] w-full"
        sizes="(min-width: 768px) 720px, 100vw"
        positionClass="object-bottom"
      />
    </div>
  );
}
