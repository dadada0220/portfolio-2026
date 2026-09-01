import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { WorkHero } from "@/components/work-hero";
import { site } from "@/lib/site";
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
    // openGraph は親（layout）とマージされず丸ごと差し替わるので、
    // 画像やサイト名もここで引き直す
    openGraph: {
      type: "article",
      siteName: site.name,
      locale: "ja_JP",
      url: `/works/${work.slug}`,
      title: work.title,
      description: work.summary,
      images: [{ ...site.ogImage, alt: work.title }],
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
      {/* サムネイルがあるときは、それを背景にしたヒーローがページ見出しを兼ねる */}
      {work.thumbnail ? (
        <WorkHero
          src={work.thumbnail}
          title={work.title}
          summary={work.summary}
        />
      ) : (
        <PageHeader
          title={work.title}
          description={work.summary}
          breadcrumbCurrent={work.title}
        />
      )}

      {/* 種別 / 領域 / スタックのサマリは一旦非表示。
          frontmatter（type / roles / stack）はそのまま持っているので、
          この行を戻せば元どおり出る */}
      {/* <WorkMeta type={work.type} roles={work.roles} stack={work.stack} /> */}

      <article
        className="prose-work"
        dangerouslySetInnerHTML={{ __html: work.html }}
      />
    </>
  );
}
