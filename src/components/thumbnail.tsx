"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

import { thumbUrl } from "@/lib/thumb";
import { cn } from "@/lib/utils";

/**
 * 記事サムネイル。
 * レターマークを常に下地として描き、画像が読めたときだけ上に重ねる。
 * 画像が無い（API が 404）/ 読み込み失敗のどちらでも自動的にレターマークへ戻る。
 */
export function Thumbnail({
  pageId,
  initial,
  alt,
  className,
  eager = false,
}: {
  pageId: string;
  initial: string;
  alt: string;
  className?: string;
  /** モーダルの先頭画像のように、開いた瞬間に見える場所では遅延読み込みしない */
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-md border bg-muted",
        className
      )}
    >
      <span
        aria-hidden
        className="font-mono text-2xl font-medium text-muted-foreground/60 select-none"
      >
        {failed ? <ImageOff className="size-5" /> : initial}
      </span>
      {failed ? null : (
        // eslint-disable-next-line @next/next/no-img-element -- 署名URL失効対策で /api/thumb を経由するため next/image は使わない
        <img
          src={thumbUrl(pageId)}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  );
}
