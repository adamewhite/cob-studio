import Image from "next/image";
import { AccentName, accents } from "../lib/accents";

export function Accent({
  name,
  className,
  sizes = "100vw",
  positionClass = "object-center",
}: {
  name: AccentName;
  className?: string;
  sizes?: string;
  positionClass?: string;
}) {
  const accent = accents[name];
  return (
    <div className={`relative overflow-hidden bg-veil ${className ?? ""}`}>
      <Image
        src={accent.src}
        alt={accent.alt}
        fill
        sizes={sizes}
        className={`object-cover ${positionClass}`}
      />
    </div>
  );
}
