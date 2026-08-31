import Link from "next/link";

import {
  WORK_TYPE_LABELS,
  WORK_TYPES,
  type WorkType,
} from "@/lib/profile";
import { cn } from "@/lib/utils";

/**
 * 実績一覧の種別フィルタ。
 * 状態はURL（`/works?type=lp`）に持たせるのでリンクで組む（クライアントJS不要）。
 */
export function WorkTypeFilter({
  active,
  counts,
}: {
  active?: WorkType;
  counts: Record<WorkType, number>;
}) {
  const options: { href: string; label: string; isActive: boolean }[] = [
    { href: "/works", label: "すべて", isActive: !active },
    ...WORK_TYPES.filter((type) => counts[type] > 0).map((type) => ({
      href: `/works?type=${type}`,
      label: `${WORK_TYPE_LABELS[type]} (${counts[type]})`,
      isActive: active === type,
    })),
  ];

  return (
    <nav aria-label="種別で絞り込み" className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <Link
          key={option.href}
          href={option.href}
          aria-current={option.isActive ? "true" : undefined}
          className={cn(
            "inline-flex h-7 items-center rounded-md border px-2.5 text-xs transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            option.isActive
              ? "border-border-strong bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
}
