import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { z } from "zod";

import { WORK_ROLES, WORK_TYPES } from "@/lib/profile";

const WORKS_DIR = path.join(process.cwd(), "content", "works");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(WORK_TYPES),
  roles: z.array(z.enum(WORK_ROLES)).min(1),
  // YAML は `period: 2025` を数値として読むので、表示用の文字列に寄せる
  period: z.union([z.string(), z.number()]).transform(String).pipe(z.string().min(1)),
  stack: z.array(z.string()).default([]),
  summary: z.string().min(1),
  thumbnail: z.string().optional(),
  published: z.boolean().default(true),
  order: z.number().int(),
});

export type WorkFrontmatter = z.infer<typeof frontmatterSchema>;

export type Work = WorkFrontmatter & {
  /** 本文をHTMLに変換したもの。一覧では使わない。 */
  html: string;
};

async function toHtml(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return String(file);
}

async function readWork(fileName: string): Promise<Work> {
  const filePath = path.join(WORKS_DIR, fileName);
  const raw = await readFile(filePath, "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `content/works/${fileName} の frontmatter が不正です:\n${z.prettifyError(parsed.error)}`
    );
  }

  const expectedSlug = fileName.replace(/\.md$/, "");
  if (parsed.data.slug !== expectedSlug) {
    throw new Error(
      `content/works/${fileName}: slug (${parsed.data.slug}) をファイル名 (${expectedSlug}) と一致させてください`
    );
  }

  return { ...parsed.data, html: await toHtml(content) };
}

let cache: Promise<Work[]> | undefined;

/** 公開中の実績を order 昇順で返す。 */
export function getWorks(): Promise<Work[]> {
  if (process.env.NODE_ENV === "production" && cache) return cache;

  const load = (async () => {
    const files = (await readdir(WORKS_DIR)).filter((f) => f.endsWith(".md"));
    const works = await Promise.all(files.map(readWork));
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
