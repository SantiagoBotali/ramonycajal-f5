import Image from "next/image";
import { getPlayerImage, isRYCPlayer } from "@/lib/data";

interface Props {
  name: string;
  size?: number;
  className?: string;
  showRing?: boolean;
}

export default function PlayerAvatar({ name, size = 48, className = "", showRing = false }: Props) {
  const src = getPlayerImage(name);
  const isRYC = isRYCPlayer(name);

  return (
    <div
      className={`relative rounded-full overflow-hidden flex-shrink-0 ${
        showRing && isRYC
          ? "ring-2 ring-primary ring-offset-2 ring-offset-surface"
          : showRing
          ? "ring-2 ring-border ring-offset-2 ring-offset-surface"
          : ""
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={name}
        fill
        className="object-cover object-top"
        sizes={`${size}px`}
      />
    </div>
  );
}
