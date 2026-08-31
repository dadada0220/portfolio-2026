/**
 * 記事のドメイン型。
 * クライアントコンポーネントからも参照するので、ここには取得処理を置かない
 * （Notion API を叩くのは `lib/notion.ts`）。
 */

export const ARTICLE_CATEGORIES = ["design", "develop", "other"] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  design: "Design",
  develop: "Develop",
  other: "Other",
};

export type Article = {
  id: string;
  category: ArticleCategory;
  title: string;
  url: string | null;
  summary: string;
  /** 種別（multi_select）。バッジで出す */
  kinds: string[];
  /** タグ + 言語。絞り込みチップの語彙。DBごとに異なる */
  tags: string[];
  /** 言語（develop DB のみ）。詳細で別枠に出す */
  languages: string[];
  /** 会社名（design / other DB のみ） */
  companies: string[];
  starred: boolean;
  createdTime: string;
};

export type ArticlesResult = {
  articles: Article[];
  /** 取得に失敗したカテゴリ。1つでもあれば UI で警告を出す */
  failedCategories: ArticleCategory[];
  /** タグの語彙。Notionに登録されている順（出現数順ではない） */
  tagOrder: Record<ArticleCategory, string[]>;
};

/**
 * 一覧の絞り込みに必要な集計だけを取り出したもの。
 * 記事本体を全件クライアントに渡さなくても、件数とタグを正しく出せるようにする。
 */
export type ArticleFacets = {
  counts: Record<ArticleCategory | "all", number>;
  /** カテゴリごとのタグ。Notionの登録順で、実際に使われているものだけ */
  tagsByCategory: Record<ArticleCategory, string[]>;
};

/** 記事一覧から絞り込み用の集計を作る。 */
export function buildFacets(
  articles: Article[],
  tagOrder: Record<ArticleCategory, string[]>
): ArticleFacets {
  const counts = { all: articles.length } as ArticleFacets["counts"];
  const tagsByCategory = {} as ArticleFacets["tagsByCategory"];

  for (const category of ARTICLE_CATEGORIES) {
    const inCategory = articles.filter(
      (article) => article.category === category
    );
    counts[category] = inCategory.length;

    const used = new Set(inCategory.flatMap((article) => article.tags));
    const ordered = (tagOrder[category] ?? []).filter((tag) => used.has(tag));
    // Notionのスキーマに無いタグ（取得失敗時など）は後ろに回す
    const rest = [...used].filter((tag) => !ordered.includes(tag)).sort();
    tagsByCategory[category] = [...ordered, ...rest];
  }

  return { counts, tagsByCategory };
}
