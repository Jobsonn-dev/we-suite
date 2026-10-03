import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/5 bg-[#131826] p-4 sm:p-5"
          style={{ animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.1}s` }}
        >
          <div className="flex gap-4">
            <Skeleton className="h-14 w-14 shrink-0 rounded-xl bg-white/5" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-2/3 bg-white/5" />
                <Skeleton className="h-3.5 w-1/3 bg-white/5" />
              </div>
              <Skeleton className="h-3 w-full bg-white/5" />
              <Skeleton className="h-3 w-5/6 bg-white/5" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-7 w-24 rounded-lg bg-white/5" />
                <Skeleton className="h-7 w-20 rounded-lg bg-white/5" />
                <Skeleton className="h-7 w-14 rounded-lg bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
