import Image from "next/image";

import { Breadcrumb } from "@/components/breadcrumb";

/**
 * 実績詳細のヒーロー。
 *
 * サムネイルをメインコンテンツの最上部に全幅で敷き、その上にパンくずとタイトルを置く。
 * 左右と上の余白は `AppShell` が持っているので、負のマージンで打ち消して端まで伸ばし、
 * 内側で同じ値を padding として与え直している（文字はコンテンツの縦ラインに乗ったまま）。
 *
 * 素材は明るい抽象グラデーションなので、覆い（`bg-hero-scrim`）を敷いた上に
 * `on-image` トークンで文字を置く。サムネイルが無い実績では使わず、通常の PageHeader に戻す。
 */
export function WorkHero({
  src,
  title,
  summary,
}: {
  src: string;
  title: string;
  summary?: string;
}) {
  return (
    <div className="relative -mx-4 -mt-8 overflow-hidden sm:-mx-6 sm:-mt-10 lg:-mx-10">
      <Image
        src={src}
        // 抽象的な背景画像で、内容はタイトルが伝える
        alt=""
        fill
        // ページ最上部に出るので遅延させない（LCPになる）
        priority
        sizes="(min-width: 1024px) calc(100vw - 15rem), 100vw"
        className="object-cover"
      />
      <div aria-hidden className="bg-hero-scrim absolute inset-0" />

      <div className="relative flex min-h-72 flex-col justify-between gap-10 px-4 pt-6 pb-8 sm:min-h-80 sm:px-6 sm:pt-8 sm:pb-10 lg:px-10">
        <Breadcrumb current={title} onImage />

        <div className="flex flex-col gap-3">
          <h1 className="w-full text-2xl font-bold tracking-tight text-on-image sm:text-3xl">
            {title}
          </h1>
          {summary ? (
            <p className="w-full text-sm leading-relaxed text-on-image-muted">
              {summary}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
