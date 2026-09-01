import type { Metadata } from "next";

import { ArticlesView } from "@/components/articles-view";
import { PageHeader } from "@/components/page-header";
import { buildFacets } from "@/lib/articles";
import { getArticles } from "@/lib/notion";

// Notion の更新を1時間ごとに取り込む（ISR）
export const revalidate = 3600;

/**
 * 最初にHTMLへ載せる件数。
 * 600件超を全部埋め込むとページが重くなるので、ここだけをサーバー描画し、
 * 残りは描画後に `/api/articles` から取りに行く。
 */
const INITIAL_COUNT = 60;

export const metadata: Metadata = {
  title: "Bookmark",
  description:
    "デザイン・開発・その他のテーマで集めているブックマーク記事の一覧。",
};

export default async function ArticlesPage() {
  const { articles, failedCategories, tagOrder } = await getArticles();

  // 件数とタグは全件から集計する（軽いので初回のHTMLに載せてよい）
  const facets = buildFacets(articles, tagOrder);

  return (
    <>
      <PageHeader
        title="ブックマーク"
        description="Notionに溜めている記事・ツール・参考サイトです。カテゴリとタグで絞り込めます。"
      />

      <ArticlesView
        initialArticles={articles.slice(0, INITIAL_COUNT)}
        facets={facets}
        failedCategories={failedCategories}
      />
    </>
  );
}
