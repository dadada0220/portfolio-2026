import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { WORK_TYPE_LABELS, type WorkType } from "@/lib/profile";

/**
 * 実績一覧のカード。
 *
 * 一段沈めた台紙の上に、画像と本文を別々の白いパネルとして乗せる。
 * 出す情報はサムネイル・種別・タイトル・概要だけで、領域（roles）は詳細ページに任せる。
 *
 * 余白は「情報のまとまり」で決める。まとまりの中は狭く、まとまりの間は広く。
 *   台紙  : 画像パネル ⇔ 本文パネル … 8px（別の面）
 *   本文  : 種別 ⇔ タイトルと概要   … 10px（属性と中身）
 *   中身  : タイトル ⇔ 概要         … 4px（概要はタイトルの続き）
 *
 * ホバーで動くのは画像だけ。画像パネルの内側の余白が広がって画像が小さくなる。
 * 高さは `aspect-16/9` の外枠が持つので、**カード全体の高さは動かない**。
 */
export type WorkCardProps = {
  slug: string;
  title: string;
  summary: string;
  type: WorkType;
  /** 任意。無いカードは画像なしで成立する */
  thumbnail?: string;
};

export function WorkCard({
  slug,
  title,
  summary,
  type,
  thumbnail,
}: WorkCardProps) {
  return (
    <Link
      href={`/works/${slug}`}
      className="group/card surface-mat flex flex-col gap-2 p-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {thumbnail ? (
        <div className="aspect-16/9 w-full overflow-hidden rounded-lg bg-card p-1 transition-[padding] duration-300 ease-out group-hover/card:p-3 motion-reduce:transition-none motion-reduce:group-hover/card:p-1">
          <div className="relative h-full w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={thumbnail}
              // 抽象的な装飾画像なので、内容はタイトルが伝える
              alt=""
              fill
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-2.5 rounded-lg border bg-card p-4">
        <Badge
          variant="secondary"
          className="text-[0.6875rem] text-muted-foreground"
        >
          {WORK_TYPE_LABELS[type]}
        </Badge>

        <div className="flex flex-col gap-1">
          <h3 className="text-[0.9375rem] font-bold tracking-tight">{title}</h3>
          <p className="line-clamp-2 text-xs leading-normal text-muted-foreground">
            {summary}
          </p>
        </div>
      </div>
    </Link>
  );
}
