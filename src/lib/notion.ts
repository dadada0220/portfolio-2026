import "server-only";

import { cache } from "react";

import { Client, isFullBlock, isFullPage } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client";
import pLimit from "p-limit";

import {
  ARTICLE_CATEGORIES,
  type Article,
  type ArticleCategory,
  type ArticlesResult,
} from "@/lib/articles";

export type {
  Article,
  ArticleCategory,
  ArticlesResult,
} from "@/lib/articles";

const DB_ENV_KEYS: Record<ArticleCategory, string> = {
  design: "NOTION_DB_DESIGN",
  develop: "NOTION_DB_DEVELOP",
  other: "NOTION_DB_OTHER",
};

let client: Client | undefined;

function getClient(): Client {
  const auth = process.env.NOTION_TOKEN;
  if (!auth) throw new Error("NOTION_TOKEN が設定されていません");
  client ??= new Client({ auth });
  return client;
}

export function isNotionConfigured(): boolean {
  return Boolean(
    process.env.NOTION_TOKEN &&
      ARTICLE_CATEGORIES.every((category) => process.env[DB_ENV_KEYS[category]])
  );
}

/* ------------------------------------------------------------------ *
 * プロパティの読み出し
 * 型が想定と違う場合は黙って空を返す（1DBのスキーマ変更で全体を落とさない）
 * ------------------------------------------------------------------ */

type Props = PageObjectResponse["properties"];

function plainText(rich: { plain_text: string }[]): string {
  return rich.map((r) => r.plain_text).join("");
}

function readTitle(props: Props): string {
  const prop = props["名前"] ?? Object.values(props).find((p) => p.type === "title");
  return prop?.type === "title" ? plainText(prop.title) : "";
}

function readRichText(props: Props, key: string): string {
  const prop = props[key];
  return prop?.type === "rich_text" ? plainText(prop.rich_text) : "";
}

function readUrl(props: Props, key: string): string | null {
  const prop = props[key];
  return prop?.type === "url" ? prop.url : null;
}

function readCheckbox(props: Props, key: string): boolean {
  const prop = props[key];
  return prop?.type === "checkbox" ? prop.checkbox : false;
}

function readCreatedTime(props: Props, key: string, fallback: string): string {
  const prop = props[key];
  return prop?.type === "created_time" ? prop.created_time : fallback;
}

/** select / multi_select のどちらでも受け取れるようにする（実DBは multi_select） */
function readNames(props: Props, key: string): string[] {
  const prop = props[key];
  if (prop?.type === "multi_select") return prop.multi_select.map((o) => o.name);
  if (prop?.type === "select") return prop.select ? [prop.select.name] : [];
  return [];
}

function toArticle(page: PageObjectResponse, category: ArticleCategory): Article {
  const props = page.properties;
  const tags = readNames(props, "タグ");
  const languages = readNames(props, "言語");

  return {
    id: page.id,
    category,
    title: readTitle(props) || "（無題）",
    url: readUrl(props, "URL"),
    summary: readRichText(props, "概要"),
    kinds: readNames(props, "種別"),
    // 言語も同じ絞り込みプールに入れる（develop DB の主要な軸のため）
    tags: [...new Set([...tags, ...languages])],
    languages,
    companies: readNames(props, "会社名"),
    starred: readCheckbox(props, "☆"),
    createdTime: readCreatedTime(props, "作成日時", page.created_time),
  };
}

/* ------------------------------------------------------------------ *
 * 取得
 * ------------------------------------------------------------------ */

const dataSourceIds = new Map<string, string>();

/** DB ID から data source ID を引く（Notion API 2025-09-03 以降はこちらを query する） */
async function getDataSourceId(databaseId: string): Promise<string> {
  const cached = dataSourceIds.get(databaseId);
  if (cached) return cached;

  // databases.retrieve の戻り値は partial の可能性がある型なので、必要な形だけ取り出す
  const database = (await getClient().databases.retrieve({
    database_id: databaseId,
  })) as { data_sources?: { id: string }[] };
  const id = database.data_sources?.[0]?.id;
  if (!id) {
    throw new Error(`データベース ${databaseId} にデータソースが見つかりません`);
  }
  dataSourceIds.set(databaseId, id);
  return id;
}

/**
 * タグの語彙を Notion に登録されている順で取り出す。
 * 出現数で並べ替えると Notion 側の意図した並びが崩れるため、スキーマの順を正とする。
 */
async function fetchTagOrder(dataSourceId: string): Promise<string[]> {
  const dataSource = (await getClient().dataSources.retrieve({
    data_source_id: dataSourceId,
  })) as {
    properties?: Record<
      string,
      { type: string; multi_select?: { options: { name: string }[] } }
    >;
  };

  const names: string[] = [];
  // 「言語」は develop DB にだけあり、タグと同じ絞り込みプールに入れている
  for (const key of ["タグ", "言語"]) {
    const property = dataSource.properties?.[key];
    if (property?.type !== "multi_select") continue;
    for (const option of property.multi_select?.options ?? []) {
      if (!names.includes(option.name)) names.push(option.name);
    }
  }
  return names;
}

type CategoryResult = { articles: Article[]; tagOrder: string[] };

async function fetchCategory(
  category: ArticleCategory
): Promise<CategoryResult> {
  const databaseId = process.env[DB_ENV_KEYS[category]];
  if (!databaseId) throw new Error(`${DB_ENV_KEYS[category]} が設定されていません`);

  const dataSourceId = await getDataSourceId(databaseId);
  const tagOrder = await fetchTagOrder(dataSourceId);
  const articles: Article[] = [];
  let cursor: string | undefined;

  // has_more / next_cursor で最後まで辿る
  do {
    const response = await getClient().dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
      start_cursor: cursor,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });

    for (const page of response.results) {
      if (isFullPage(page)) articles.push(toArticle(page, category));
    }
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return { articles, tagOrder };
}

/**
 * 3つのDBを取得してマージする。
 * Notion のレート制限は平均3req/sec なので並列度は3に絞る。
 * 一部のDBが落ちても残りは返す（サイト全体を落とさない）。
 */
export const getArticles = cache(async function getArticles(): Promise<ArticlesResult> {
  const emptyTagOrder = Object.fromEntries(
    ARTICLE_CATEGORIES.map((category) => [category, [] as string[]])
  ) as Record<ArticleCategory, string[]>;

  if (!isNotionConfigured()) {
    return {
      articles: [],
      failedCategories: [...ARTICLE_CATEGORIES],
      tagOrder: emptyTagOrder,
    };
  }

  const limit = pLimit(3);
  const settled = await Promise.all(
    ARTICLE_CATEGORIES.map(async (category) => {
      try {
        return { category, result: await limit(() => fetchCategory(category)) };
      } catch (error) {
        console.error(`[notion] ${category} の取得に失敗しました`, error);
        return { category, result: null };
      }
    })
  );

  const articles = settled
    .flatMap((entry) => entry.result?.articles ?? [])
    .sort((a, b) => b.createdTime.localeCompare(a.createdTime));

  const tagOrder = { ...emptyTagOrder };
  for (const entry of settled) {
    if (entry.result) tagOrder[entry.category] = entry.result.tagOrder;
  }

  return {
    articles,
    failedCategories: settled
      .filter((entry) => entry.result === null)
      .map((entry) => entry.category),
    tagOrder,
  };
});

/**
 * 単一記事。ISRでキャッシュ済みの一覧から引く。
 * pages.retrieve を叩かないので、カテゴリの逆引きも不要になる。
 */
export async function getArticle(pageId: string): Promise<Article | null> {
  const { articles } = await getArticles();
  const normalized = pageId.replace(/-/g, "");
  return (
    articles.find((article) => article.id.replace(/-/g, "") === normalized) ??
    null
  );
}

/** 本文ブロック。一覧生成時には呼ばず、モーダル/詳細ページを開いた時だけ呼ぶ。 */
export async function getArticleBlocks(
  pageId: string
): Promise<BlockObjectResponse[]> {
  if (!isNotionConfigured()) return [];

  try {
    const blocks: BlockObjectResponse[] = [];
    let cursor: string | undefined;

    do {
      const response = await getClient().blocks.children.list({
        block_id: pageId,
        page_size: 100,
        start_cursor: cursor,
      });
      for (const block of response.results) {
        if (isFullBlock(block)) blocks.push(block);
      }
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return blocks;
  } catch (error) {
    console.error(`[notion] ページ ${pageId} の本文取得に失敗しました`, error);
    return [];
  }
}

/**
 * サムネイル用に「1番目のブロックの画像URL」を引く。
 * Notion ホストのファイルは署名URLが約1時間で失効するため、
 * ここで返したURLは埋め込まず `/api/thumb/[pageId]` から都度引き直して中継する。
 */
export async function getFirstImageUrl(pageId: string): Promise<string | null> {
  if (!isNotionConfigured()) return null;

  try {
    const response = await getClient().blocks.children.list({
      block_id: pageId,
      page_size: 1,
    });
    const first = response.results[0];
    if (!first || !isFullBlock(first) || first.type !== "image") return null;

    const image = first.image;
    return image.type === "external" ? image.external.url : image.file.url;
  } catch {
    return null;
  }
}
