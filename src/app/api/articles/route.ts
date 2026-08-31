import { getArticles } from "@/lib/notion";

/**
 * 記事の全件。
 *
 * 一覧ページのHTMLには最初に表示する分（先頭60件）しか載せていないので、
 * 残りは描画後にここから取りに来る。ISRと同じ間隔でCDNにキャッシュさせる。
 */
export const revalidate = 3600;

export async function GET() {
  const { articles } = await getArticles();

  return Response.json(
    { articles },
    {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
