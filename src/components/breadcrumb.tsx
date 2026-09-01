"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, House } from "lucide-react";

import { findNavItem } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * コンテンツ上部のパンくず。
 *
 * 詳細ページから一覧へ戻る導線を兼ねるので、**親の階層は必ずリンクにする**
 * （個別の「戻る」ボタンは置かない）。
 * トップは階層が無いので何も出さない。
 */
export function Breadcrumb({
  current,
  onImage = false,
}: {
  current?: ReactNode;
  /** ヒーロー画像の上に置くとき。面の色ではなく覆いの上の色に切り替える */
  onImage?: boolean;
}) {
  const pathname = usePathname();
  const section = findNavItem(pathname);

  if (pathname === "/") return null;

  const items: { label: ReactNode; href?: string }[] = [];
  if (section && section.href !== "/") {
    // 詳細ページのときだけ、セクションをリンクにして戻れるようにする
    items.push({ label: section.label, href: current ? section.href : undefined });
  }
  if (current) items.push({ label: current });

  return (
    <nav aria-label="パンくずリスト">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1 text-xs",
          onImage ? "text-on-image-muted" : "text-muted-foreground"
        )}
      >
        <li className="flex items-center">
          <Link
            href="/"
            aria-label="ホーム"
            className={cn(
              "rounded-md p-0.5 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              onImage ? "hover:text-on-image" : "hover:text-foreground"
            )}
          >
            <House className="size-[13px]" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex min-w-0 items-center gap-1">
            <ChevronRight aria-hidden className="size-3 shrink-0 opacity-60" />
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "truncate rounded-md transition-colors outline-none hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50",
                  onImage ? "hover:text-on-image" : "hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={cn(
                  "truncate",
                  onImage ? "text-on-image" : "text-foreground"
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
