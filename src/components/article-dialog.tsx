"use client";

import { useEffect, useState } from "react";
import type { BlockObjectResponse } from "@notionhq/client";
import { ExternalLink, Star } from "lucide-react";

import { ArticleBlocks } from "@/components/article-blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORY_LABELS, type Article } from "@/lib/articles";
import { formatDate, getDomain } from "@/lib/url";

/** 取得済みの本文をページIDごとに保持する。2回目以降は待ち時間ゼロで開く。 */
const blockCache = new Map<string, BlockObjectResponse[]>();

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-sm">{value}</dd>
    </div>
  );
}

type BlocksState = {
  id: string | null;
  blocks: BlockObjectResponse[] | null;
  failed: boolean;
};

function useArticleBlocks(article: Article | null) {
  const [state, setState] = useState<BlocksState>({
    id: null,
    blocks: null,
    failed: false,
  });

  // 開いている記事が変わったらレンダー中に状態を差し替える。
  // キャッシュ済みならこの時点で本文が入るので、スケルトンを挟まずに表示できる。
  if (article && state.id !== article.id) {
    setState({
      id: article.id,
      blocks: blockCache.get(article.id) ?? null,
      failed: false,
    });
  }

  useEffect(() => {
    if (!article || blockCache.has(article.id)) return;

    const controller = new AbortController();

    fetch(`/api/articles/${article.id}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<{ blocks: BlockObjectResponse[] }>;
      })
      .then(({ blocks }) => {
        blockCache.set(article.id, blocks);
        setState({ id: article.id, blocks, failed: false });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error("[articles] 本文の取得に失敗しました", error);
        setState({ id: article.id, blocks: null, failed: true });
      });

    return () => controller.abort();
  }, [article]);

  return {
    blocks: article && state.id === article.id ? state.blocks : null,
    failed: article !== null && state.id === article.id && state.failed,
  };
}

/**
 * 記事の詳細。
 * 一覧が持っているデータでそのまま描画するので、開くのに通信は発生しない。
 * 唯一一覧に無い本文ブロックだけ後から差し込み、その間はスケルトンを出す。
 */
export function ArticleDialog({
  article,
  onClose,
}: {
  article: Article | null;
  onClose: () => void;
}) {
  const { blocks, failed } = useArticleBlocks(article);
  const domain = getDomain(article?.url);

  return (
    <Dialog
      open={article !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-2xl">
        {article ? (
          <>
            <DialogTitle className="sr-only">{article.title}</DialogTitle>
            <DialogDescription className="sr-only">
              ブックマークした記事の詳細
            </DialogDescription>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 pr-8">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline">
                    {CATEGORY_LABELS[article.category]}
                  </Badge>
                  {article.kinds.map((kind) => (
                    <Badge key={kind} variant="secondary">
                      {kind}
                    </Badge>
                  ))}
                  {article.starred ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Star
                        aria-hidden
                        className="size-3.5 fill-star text-star"
                      />
                      おすすめ
                    </span>
                  ) : null}
                </div>

                <h2 className="text-lg font-bold tracking-tight">
                  {article.title}
                </h2>

                {article.summary ? (
                  <p className="text-sm text-muted-foreground">
                    {article.summary}
                  </p>
                ) : null}
              </div>

              {article.url ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <ExternalLink data-icon="inline-start" />
                      記事を開く
                    </a>
                  </Button>
                  <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
                    {domain}
                  </span>
                </div>
              ) : null}

              <dl className="flex flex-col gap-2 rounded-lg border bg-elevated p-4">
                <MetaRow
                  label="タグ"
                  value={
                    article.tags.length > 0 ? article.tags.join(" / ") : "未設定"
                  }
                />
                {article.languages.length > 0 ? (
                  <MetaRow label="言語" value={article.languages.join(" / ")} />
                ) : null}
                <MetaRow
                  label="会社名"
                  value={
                    article.companies.length > 0
                      ? article.companies.join(" / ")
                      : "未設定"
                  }
                />
                <MetaRow
                  label="作成日時"
                  value={formatDate(article.createdTime)}
                />
              </dl>

              {failed ? (
                <p className="text-xs text-muted-foreground">
                  本文を取得できませんでした。
                </p>
              ) : blocks === null ? (
                <div className="flex flex-col gap-2" aria-label="本文を読み込み中">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <ArticleBlocks blocks={blocks} pageId={article.id} />
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
