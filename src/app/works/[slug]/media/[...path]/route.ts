import { readFile } from "node:fs/promises";
import path from "node:path";

import { WORKS_DIR } from "@/lib/works";

/**
 * 実績の素材（画像など）の配信。
 *
 * 素材は本文と同じ `content/works/<slug>/` に置く。`content/` は public ではないので、
 * ここから読んで返す。本文中の相対パスは `remarkWorkAssets` がこのURLに書き換える。
 *
 * public に置かずディレクトリを分けているのは、記事とその素材を1箇所にまとめて
 * 増減させたいため（記事を消すときディレクトリごと消せる）。
 */
const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(
  _request: Request,
  { params }: RouteContext<"/works/[slug]/media/[...path]">
) {
  const { slug, path: segments } = await params;

  if (!SLUG.test(slug)) {
    return new Response("Invalid slug", { status: 400 });
  }

  const requested = segments.join("/");
  const extension = path.extname(requested).toLowerCase();
  const contentType = CONTENT_TYPES[extension];
  if (!contentType) {
    return new Response("Unsupported file type", { status: 404 });
  }

  // `..` や絶対パスで content/works/<slug>/ の外に出られないようにする
  const workDir = path.join(WORKS_DIR, slug);
  const filePath = path.resolve(workDir, requested);
  if (filePath !== workDir && !filePath.startsWith(workDir + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  let file: Buffer;
  try {
    file = await readFile(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
      // 素材はデプロイ単位で固定。差し替えるときはファイル名を変える
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
