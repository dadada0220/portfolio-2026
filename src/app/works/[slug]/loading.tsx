import {
  CardGridSkeleton,
  PageHeaderSkeleton,
  ProseSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <CardGridSkeleton count={4} columns="sm:grid-cols-2 lg:grid-cols-4" lines={1} />
      <ProseSkeleton />
    </>
  );
}
