import { PageHeaderSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="flex max-w-xl flex-col gap-5 rounded-lg border bg-card p-6">
        {[1, 2].map((index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </>
  );
}
