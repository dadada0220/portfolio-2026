import {
  CardGridSkeleton,
  PageHeaderSkeleton,
  SectionHeadingSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-4">
        <SectionHeadingSkeleton />
        <CardGridSkeleton count={6} lines={3} />
      </div>
      <div className="flex flex-col gap-4">
        <SectionHeadingSkeleton />
        <CardGridSkeleton count={4} columns="grid-cols-1" lines={2} />
      </div>
    </>
  );
}
