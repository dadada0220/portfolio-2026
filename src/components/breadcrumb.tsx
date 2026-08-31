"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, House } from "lucide-react";

import { findNavItem } from "@/lib/site";

/**
 * コンテンツ上部のパンくず。
 *
 * 詳細ページから一覧へ戻る導線を兼ねるので、**親の階層は必ずリンクにする**
 * （個別の「戻る」ボタンは置かない）。
 * トップは階層が無いので何も出さない。
 */
export function Breadcrumb({ current }: { current?: ReactNode }) {
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
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li className="flex items-center">
          <Link
            href="/"
            aria-label="ホーム"
            className="rounded-md p-0.5 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <House className="size-[15px]" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex min-w-0 items-center gap-1.5">
            <ChevronRight aria-hidden className="size-3.5 shrink-0 opacity-60" />
            {item.href ? (
              <Link
                href={item.href}
                className="truncate rounded-md transition-colors outline-none hover:text-foreground hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="truncate text-foreground"
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
