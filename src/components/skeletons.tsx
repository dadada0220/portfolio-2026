import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * 画面遷移中に出すスケルトン。
 * 実際のレイアウトと同じ骨格・同じ余白で組み、読み込み後に要素が飛ばないようにする。
 */

export function PageHeaderSkeleton({ hasDescription = true }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-64" />
      {hasDescription ? (
        <div className="flex flex-col gap-1.5 pt-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ) : null}
    </div>
  );
}

function CardSkeleton({ lines = 2, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("surface-card flex flex-col gap-2 p-4", className)}>
      <Skeleton className="h-4 w-24" />
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-4", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export function CardGridSkeleton({
  count = 6,
  columns = "sm:grid-cols-2",
  lines = 2,
}: {
  count?: number;
  columns?: string;
  lines?: number;
}) {
  return (
    <div className={cn("grid gap-3", columns)}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} lines={lines} />
      ))}
    </div>
  );
}

export function SectionHeadingSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

export function ChipRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-7 w-28 rounded-md" />
      ))}
    </div>
  );
}

export function ArticleListSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-8 w-80 rounded-lg" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-7 w-24 rounded-md" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-4 w-96" />
      <Skeleton className="h-4 w-12" />
      <div className="surface-card overflow-hidden">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 border-b py-3 pr-11 pl-3 last:border-b-0"
          >
            <Skeleton className="mt-0.5 size-4 shrink-0 rounded-sm" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProseSkeleton({ blocks = 3 }: { blocks?: number }) {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: blocks }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
