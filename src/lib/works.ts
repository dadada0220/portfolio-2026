import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import remarkDirective from "remark-directive";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { z } from "zod";

import { remarkWorkAssets } from "@/lib/markdown/remark-work-assets";
import { remarkWorkBlocks } from "@/lib/markdown/remark-work-blocks";
import { remarkWorkLinks } from "@/lib/markdown/remark-work-links";
import { WORK_TYPES } from "@/lib/profile";

/**
 * 実績は1件につき1ディレクトリ。本文は必ず `index.md`。
 * 画像などの素材は同じディレクトリに置く（本文からは `![](figma-01.png)` と相対パスで参照する）。
 *
 *   content/works/<slug>/index.md
 *   content/works/<slug>/figma-01.png
 *
 * ディレクトリ名がそのまま slug になる。
 */
export const WORKS_DIR = path.join(process.cwd(), "content", "works");
export const WORK_ENTRY_FILE = "index.md";

const frontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  // 種別だけは選択肢を固定する（一覧の絞り込みタブがこの値で作られるため）
  type: z.enum(WORK_TYPES),
  // roles / stack はマスタを持たない。md に書いた文字列をそのまま画面に出す
  roles: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string()).default([]),
  summary: z.string().min(1),
  /**
   * サムネイル。一覧カードと詳細ページ上部で使う。
   * `/images/works/thumb-1.png` のように `/` 始まりで書くと public のパスとして扱い、
   * `hero.png` のように書くと記事自身のディレクトリの素材として解決する。
   */
  thumbnail: z.string().min(1).optional(),
  published: z.boolean().default(true),
  order: z.number().int(),
});

export type WorkFrontmatter = z.infer<typeof frontmatterSchema>;

export type Work = WorkFrontmatter & {
  /** 本文をHTMLに変換したもの。一覧では使わない。 */
  html: string;
};

/**
 * frontmatter の `thumbnail` を配信URLに直す。
 * 本文中の画像（`remarkWorkAssets`）と同じ規則で、相対パスは記事自身の素材として解く。
 */
function resolveThumbnail(
  thumbnail: string | undefined,
  slug: string
): string | undefined {
  if (!thumbnail) return undefined;
  if (/^([a-z]+:)?\/\//i.test(thumbnail) || thumbnail.startsWith("/")) {
    return thumbnail;
  }
  return `/works/${slug}/media/${thumbnail.replace(/^\.\//, "")}`;
}

async function toHtml(markdown: string, slug: string): Promise<string> {
  const file = await remark()
    // ディレクティブの解析 → ブロックへの変換、の順に通す
    .use(remarkDirective)
    .use(remarkWorkBlocks, { source: `content/works/${slug}/${WORK_ENTRY_FILE}` })
    .use(remarkWorkAssets, { slug })
    .use(remarkGfm)
    // GFM の自動リンクも含めてから属性を付ける
    .use(remarkWorkLinks)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return String(file);
}

async function readWork(slug: string): Promise<Work> {
  const filePath = path.join(WORKS_DIR, slug, WORK_ENTRY_FILE);

  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    throw new Error(
      `content/works/${slug}/ に ${WORK_ENTRY_FILE} がありません（実績は1件につき1ディレクトリ、本文は index.md）`
    );
  }

  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `content/works/${slug}/${WORK_ENTRY_FILE} の frontmatter が不正です:\n${z.prettifyError(parsed.error)}`
    );
  }

  if (parsed.data.slug !== slug) {
    throw new Error(
      `content/works/${slug}/${WORK_ENTRY_FILE}: slug (${parsed.data.slug}) をディレクトリ名 (${slug}) と一致させてください`
    );
  }

  return {
    ...parsed.data,
    thumbnail: resolveThumbnail(parsed.data.thumbnail, slug),
    html: await toHtml(content, slug),
  };
}

let cache: Promise<Work[]> | undefined;

/** 公開中の実績を order 昇順で返す。 */
export function getWorks(): Promise<Work[]> {
  if (process.env.NODE_ENV === "production" && cache) return cache;

  const load = (async () => {
    const entries = await readdir(WORKS_DIR, { withFileTypes: true });

    // ディレクトリを切り忘れた .md を黙って無視すると、記事が一覧から消えたように見える
    const strays = entries.filter((e) => e.isFile() && e.name.endsWith(".md"));
    if (strays.length > 0) {
      throw new Error(
        `content/works/ 直下に ${strays.map((e) => e.name).join(", ")} があります。` +
          `実績ごとにディレクトリを切り、本文を <slug>/${WORK_ENTRY_FILE} に置いてください`
      );
    }

    // `.` / `_` 始まりは実績ではない置き場として読み飛ばす
    const slugs = entries
      .filter(
        (entry) =>
          entry.isDirectory() &&
          !entry.name.startsWith(".") &&
          !entry.name.startsWith("_")
      )
      .map((entry) => entry.name);

    const works = await Promise.all(slugs.map(readWork));
    return works
      .filter((work) => work.published)
      .sort((a, b) => a.order - b.order);
  })();

  cache = load;
  return load;
}

export async function getWork(slug: string): Promise<Work | undefined> {
  const works = await getWorks();
  return works.find((work) => work.slug === slug);
}
