import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * スキル1件。
 * アイコンタイルにだけグラデーションを使い、本文はニュートラルのまま置く。
 * （色を面で使わず点で使うことで、賑やかさと落ち着きを両立させる）
 */
export function SkillItem({
  title,
  lines,
  icon: Icon,
  tile,
}: {
  title: string;
  lines: string[];
  icon: LucideIcon;
  tile: 1 | 2 | 3 | 4 | 5 | 6;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm",
            `tile-${tile}`
          )}
        >
          <Icon className="size-[18px]" />
        </span>
        <h3 className="text-base font-bold tracking-tight">{title}</h3>
      </div>

      <ul className="flex flex-col gap-0.5">
        {lines.map((line) => (
          <li
            key={line}
            className="relative pl-4 text-sm leading-relaxed text-muted-foreground before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-primary"
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
