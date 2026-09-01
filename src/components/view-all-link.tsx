import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * セクションから一覧へ送る導線。
 *
 * 枠線も塗りも持たない素のリンク。太さは本文と同じで、動きだけで存在を示す
 * （ボタンの箱を増やさずに導線を置く）。
 *
 * ホバーで2つ動く。
 * - 下線が左から引かれる
 * - 矢印が右へ抜けて、入れ替わりに次の矢印が左から入る
 * どちらも「押すと次の画面へ送られる」ことの説明で、装飾のための動きではない。
 */
export function ViewAllLink({
  href,
  children = "View All",
}: {
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group/view inline-flex shrink-0 items-center gap-2 rounded-md text-[0.8125rem] tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-300 ease-out group-hover/view:scale-x-100 motion-reduce:transition-none"
        />
      </span>

      <span aria-hidden className="relative flex size-4 overflow-hidden">
        <ArrowRight className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover/view:translate-x-full motion-reduce:transition-none" />
        <ArrowRight className="absolute size-4 shrink-0 -translate-x-full transition-transform duration-300 ease-out group-hover/view:translate-x-0 motion-reduce:transition-none" />
      </span>
    </Link>
  );
}
