import {
  CardGridSkeleton,
  PageHeaderSkeleton,
  SectionHeadingSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <CardGridSkeleton count={3} columns="sm:grid-cols-3" lines={2} />
      <div className="flex flex-col gap-4">
        <SectionHeadingSkeleton />
        <CardGridSkeleton count={6} columns="sm:grid-cols-2 lg:grid-cols-3" />
      </div>
      <div className="flex flex-col gap-4">
        <SectionHeadingSkeleton />
        <CardGridSkeleton count={3} columns="sm:grid-cols-2 lg:grid-cols-3" />
      </div>
    </>
  );
}
