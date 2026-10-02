import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function LoadingState({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="gap-0 overflow-hidden p-0">
          <Skeleton className="h-1 w-full rounded-none" />
          <div className="grid gap-4 p-4 sm:grid-cols-[auto,1fr] sm:p-5">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3.5 w-1/3" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-7 w-24 rounded-md" />
                <Skeleton className="h-7 w-20 rounded-md" />
                <Skeleton className="h-7 w-14 rounded-md" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
