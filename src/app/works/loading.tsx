import {
  CardGridSkeleton,
  ChipRowSkeleton,
  PageHeaderSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-4">
        <ChipRowSkeleton />
        <CardGridSkeleton count={6} lines={3} />
      </div>
    </>
  );
}
