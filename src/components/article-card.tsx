"use client";

import { ExternalLink, Expand, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Thumbnail } from "@/components/thumbnail";
import type { Article } from "@/lib/articles";
import { prefetchThumb } from "@/lib/thumb";
import { formatDate, getDomain, getInitial } from "@/lib/url";
import { cn } from "@/lib/utils";

/** カード。行と同じく、面全体が外部リンクで詳細はサブ導線。 */
export function ArticleCard({
  article,
  onOpenDetail,
}: {
  article: Article;
  onOpenDetail: (article: Article) => void;
}) {
  const domain = getDomain(article.url);

  const body = (
    <>
      <Thumbnail
        pageId={article.id}
        initial={getInitial(article.url, article.title)}
        alt=""
        className="aspect-video w-full"
      />

      <div className="flex flex-wrap items-center gap-1.5 pr-8">
        {article.kinds.map((kind) => (
          <Badge key={kind} variant="secondary">
            {kind}
          </Badge>
        ))}
        {article.starred ? (
          <Star
            aria-label="おすすめ"
            className="ml-auto size-4 shrink-0 fill-star text-star"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-2 text-sm font-medium underline-offset-4 group-hover:underline">
          {article.title}
        </h3>
        {article.summary ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {article.summary}
          </p>
        ) : null}
      </div>

      {article.tags.length > 0 ? (
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {article.tags.join(" / ")}
        </p>
      ) : null}

      <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
        {domain ? (
          <>
            <ExternalLink aria-hidden className="size-3 shrink-0" />
            <span className="truncate font-mono">{domain}</span>
          </>
        ) : null}
        <span className="ml-auto shrink-0 font-mono">
          {formatDate(article.createdTime)}
        </span>
      </div>
    </>
  );

  const surface =
    "group flex h-full w-full flex-col gap-3 p-3 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <div className="relative flex h-full w-full rounded-lg border bg-card shadow-sm transition-colors hover:border-border-strong hover:bg-elevated">
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
        <button
          type="button"
          onClick={() => onOpenDetail(article)}
          className={cn(surface, "cursor-pointer")}
        >
          {body}
        </button>
      )}

      <button
        type="button"
        onClick={() => onOpenDetail(article)}
        // カードは Thumbnail が同じURLで既に読み込み済みだが、
        // 画面外から入ってきた直後などに備えて念のため呼んでおく（2回目以降は何もしない）
        onPointerEnter={() => prefetchThumb(article.id)}
        aria-label={`${article.title} の詳細を見る`}
        title="詳細を見る"
        className="absolute top-5 right-5 rounded-md bg-background/85 p-1.5 text-muted-foreground backdrop-blur transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Expand aria-hidden className="size-4" />
      </button>
    </div>
  );
}
