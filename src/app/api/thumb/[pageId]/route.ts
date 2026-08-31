import { getFirstImageUrl } from "@/lib/notion";

/**
 * 記事サムネイルの中継。
 *
 * - Notionページの1番目のブロックが画像ならそれを返す
 * - Notionホストのファイルは署名URLが約1時間で失効するため、URLを埋め込まず
 *   リクエストのたびに引き直してから中継する
 * - 画像が無い / 取得に失敗した場合は 404。呼び出し側（Thumbnail）が
 *   レターマークのフォールバックに切り替える
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/thumb/[pageId]">
) {
  const { pageId } = await params;

  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(pageId)) {
    return new Response("Invalid page id", { status: 400 });
  }

  const imageUrl = await getFirstImageUrl(pageId);
  if (!imageUrl) {
    return new Response("Not found", {
      status: 404,
      // 画像が無いことも一定時間覚えさせる（レターマークのまま何度も問い合わせない）
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
    });
  }

  let upstream: Response;
  try {
    upstream = await fetch(imageUrl, { cache: "no-store" });
  } catch {
    return new Response("Upstream error", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream error", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  if (!contentType.startsWith("image/")) {
    return new Response("Not an image", { status: 404 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      /**
       * ブラウザにもキャッシュさせるのが重要。
       * 一覧のカードと詳細モーダルは同じURLでこの画像を読むので、
       * ここが `max-age=0` だとモーダルを開くたびに取り直しになる。
       * CDN側は1日、ブラウザはISRと同じ1時間持たせる。
       */
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
