"use client";

import { ExternalLink, Expand, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/articles";
import { prefetchThumb } from "@/lib/thumb";
import { formatDate, getDomain } from "@/lib/url";
import { cn } from "@/lib/utils";

/**
 * 一覧の1行。
 * メインの体験は「記事にすぐ飛べること」なので、行全体が外部リンク。
 * Notionに書いた詳細を見るボタンは右端のサブ導線に置く。
 */
export function ArticleRow({
  article,
  onOpenDetail,
}: {
  article: Article;
  onOpenDetail: (article: Article) => void;
}) {
  const domain = getDomain(article.url);

  const body = (
    <>
      <Star
        aria-label={article.starred ? "おすすめ" : undefined}
        className={cn(
          "mt-0.5 size-4 shrink-0",
          article.starred
            ? "fill-star text-star"
            : "text-muted-foreground/30"
        )}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-medium underline-offset-4 group-hover:underline">
            {article.title}
          </span>
          {article.kinds.map((kind) => (
            <Badge key={kind} variant="secondary">
              {kind}
            </Badge>
          ))}
        </div>

        {article.summary ? (
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {article.summary}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {domain ? (
            <span className="inline-flex items-center gap-1 font-mono">
              <ExternalLink aria-hidden className="size-3" />
              {domain}
            </span>
          ) : null}
          <span className="font-mono">{formatDate(article.createdTime)}</span>
          {article.tags.length > 0 ? (
            <span className="truncate">{article.tags.join(" / ")}</span>
          ) : null}
        </div>
      </div>
    </>
  );

  const surface =
    "group flex items-start gap-3 py-3 pr-11 pl-3 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset";

  // リストではサムネイルを出していないので、詳細を開きそうになった時点で先読みしておく。
  // マウス・キーボード・タッチのどれでもクリックより先に発火する。
  const prefetch = () => prefetchThumb(article.id);

  return (
    <li className="relative border-b last:border-b-0">
      {article.url ? (
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer noopener"
          className={surface}
        >
          {body}
        </a>
      ) : (
        // URLが無い記事はNotionの詳細が本体なので、行全体で詳細を開く
        <button
          type="button"
          onClick={() => onOpenDetail(article)}
          onPointerEnter={prefetch}
          onPointerDown={prefetch}
          onFocus={prefetch}
          className={cn(surface, "w-full")}
        >
          {body}
        </button>
      )}

      <button
        type="button"
        onClick={() => onOpenDetail(article)}
        onPointerEnter={prefetch}
        onPointerDown={prefetch}
        onFocus={prefetch}
        aria-label={`${article.title} の詳細を見る`}
        title="詳細を見る"
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Expand aria-hidden className="size-4" />
      </button>
    </li>
  );
}
