import { ArticleListSkeleton, PageHeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <ArticleListSkeleton />
    </>
  );
}
