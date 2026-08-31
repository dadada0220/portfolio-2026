import { getArticleBlocks } from "@/lib/notion";

const PAGE_ID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

/**
 * 記事本文のブロック。
 * 一覧には本文が含まれていないので、モーダルを開いたときだけここを叩く。
 * モーダル自体は一覧のデータで即座に開き、本文だけ後から差し込む。
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/articles/[pageId]">
) {
  const { pageId } = await params;
  if (!PAGE_ID.test(pageId)) {
    return Response.json({ error: "Invalid page id" }, { status: 400 });
  }

  const blocks = await getArticleBlocks(pageId);

  return Response.json(
    { blocks },
    {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=1800, stale-while-revalidate=3600",
      },
    }
  );
}
