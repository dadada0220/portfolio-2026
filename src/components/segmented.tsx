import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * セグメントコントロール。
 *
 * 一段沈んだレールの上を、選択中の1枚だけが白く浮く。
 * 選択中は **面（白 + 影 + リング）で示し、文字の太さは変えない**
 * — 太さが変わると幅が動いて、隣の項目が押し出されるため。
 *
 * `href` を渡すとリンクとして描画する（実績一覧はURLに状態を持たせるのでJS不要）。
 * 渡さない場合はボタンになり、`onSelect` で受ける。
 */
export type SegmentedItem = {
  value: string;
  label: ReactNode;
  /** 指定するとリンクになる */
  href?: string;
};

const ITEM =
  "inline-flex h-7 shrink-0 items-center justify-center rounded-md px-3 text-[0.8125rem] font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

const ACTIVE = "bg-card text-foreground shadow-sm ring-1 ring-foreground/10";
const INACTIVE = "text-muted-foreground hover:text-foreground";

export function Segmented({
  items,
  value,
  onSelect,
  label,
  className,
}: {
  items: SegmentedItem[];
  value: string;
  onSelect?: (value: string) => void;
  /** スクリーンリーダー向けの説明 */
  label: string;
  className?: string;
}) {
  return (
    <div
      role={items[0]?.href ? undefined : "group"}
      aria-label={label}
      className={cn(
        "inline-flex w-fit max-w-full items-center gap-0.5 overflow-x-auto rounded-lg border bg-muted p-0.5",
        className
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        const classes = cn(ITEM, active ? ACTIVE : INACTIVE);

        return item.href ? (
          <Link
            key={item.value}
            href={item.href}
            aria-current={active ? "true" : undefined}
            className={classes}
          >
            {item.label}
          </Link>
        ) : (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect?.(item.value)}
            className={cn(classes, "cursor-pointer")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
