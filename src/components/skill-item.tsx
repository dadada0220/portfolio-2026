import type { ReactNode } from "react";
import Image from "next/image";

import type { SkillIcon } from "@/components/skill-icons";
import { withLineBreaks } from "@/lib/text";
import { cn } from "@/lib/utils";

/**
 * スキル1件。
 *
 * 面の作りはサイト共通の `surface-card`。
 * 見出し行は **24px のタイル + 16px の塗りアイコン（白）**。
 * タイルの下地は実績と同じ抽象素材。**暗い覆いは敷かず、彩度を上げて**白いグリフを立たせる
 * （覆いで暗くすると素材の色が濁るため）。仕上げにグリフ自身の影で輪郭を確保する。
 * 「その他」だけは色を持たせず、同じ素材を無彩色にして使う。
 * **押せない要素なのでホバーでは動かさない**（design-system「ホバー」）。
 *
 * 余白は情報のまとまりで決める。
 *   タイル ⇔ タイトル … 8px（横並びで1行の見出し）
 *   見出し ⇔ 本文     … 12px
 */
export function SkillItem({
  title,
  body,
  icon: Icon,
  thumbnail,
  neutral = false,
}: {
  title: string;
  /** 文字列に `<br />` と書けば改行になる。JSXで組んでもよい */
  body: ReactNode;
  icon: SkillIcon;
  thumbnail: string;
  /** 「その他」だけは色を持たせず無彩色にする */
  neutral?: boolean;
}) {
  return (
    <div className="surface-card flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10"
        >
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="24px"
            className={cn(
              "object-cover",
              neutral ? "grayscale" : "saturate-220"
            )}
          />
          <Icon className="relative size-4 text-white drop-shadow-glyph" />
        </span>
        <h3 className="text-[0.9375rem] font-bold tracking-tight">{title}</h3>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {withLineBreaks(body)}
      </p>
    </div>
  );
}
