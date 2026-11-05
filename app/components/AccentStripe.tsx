import { Accent } from "./Accent";
import { AccentName } from "../lib/accents";

// Wide, short photo band that closes out the artwork pages. Most accents are
// portrait, so each one names the part of the frame worth keeping.
const stripes: { name: AccentName; position: string }[] = [
  { name: "indianPipes", position: "object-[center_40%]" },
  { name: "mountainView", position: "object-[center_62%]" },
  { name: "rainyWindow", position: "object-[center_52%]" },
  { name: "barnSlats", position: "object-center" },
];

export function AccentStripe({
  index = 0,
  className = "mt-16",
}: {
  index?: number;
  className?: string;
}) {
  const s = stripes[index % stripes.length];
  return (
    <Accent
      name={s.name}
      positionClass={s.position}
      className={`h-24 w-full sm:h-32 ${className}`}
      sizes="(min-width: 1280px) 1232px, 100vw"
    />
  );
}
