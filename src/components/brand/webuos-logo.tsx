import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = {
  sm: { h: 28, w: 129 },
  md: { h: 34, w: 156 },
  lg: { h: 48, w: 221 },
  xl: { h: 76, w: 350 },
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
      className={cn("h-auto w-auto", className)}
      priority
      unoptimized
    />
  );
}
