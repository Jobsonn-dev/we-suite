import Image from "next/image";
import { cn } from "@/lib/utils";

// Logo dimensions — height in px, width derived from aspect ratio (3018:653 ≈ 4.62:1)
const sizes = {
  sm: { h: 24, w: 111 },
  md: { h: 30, w: 139 },
  lg: { h: 44, w: 203 },
  xl: { h: 72, w: 333 },
};

export function WebuosLogo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const dim = sizes[size];
  return (
    <Image
      src="/webuos-brand.png"
      alt="WEBUOS"
      width={dim.w}
      height={dim.h}
      className={cn("shrink-0", className)}
      style={{ height: `${dim.h}px`, width: `${dim.w}px` }}
      priority
      unoptimized
    />
  );
}
