import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { WorkMeta } from "@/components/work-meta";
import { getWork, getWorks } from "@/lib/works";

export async function generateStaticParams() {
  const works = await getWorks();
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/works/[slug]">): Promise<Metadata> {
  const work = await getWork((await params).slug);
  if (!work) return {};

  return {
    title: work.title,
    description: work.summary,
    openGraph: {
      title: work.title,
      description: work.summary,
      type: "article",
    },
  };
}

export default async function WorkDetailPage({
  params,
}: PageProps<"/works/[slug]">) {
  const work = await getWork((await params).slug);
  if (!work) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Works"
        title={work.title}
        description={work.summary}
        breadcrumbCurrent={work.title}
      />

      <WorkMeta type={work.type} roles={work.roles} stack={work.stack} />

      <article
        className="prose-work"
        dangerouslySetInnerHTML={{ __html: work.html }}
      />
    </>
  );
}
