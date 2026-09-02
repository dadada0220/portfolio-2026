import type { SVGProps } from "react";

/**
 * スキルカードのアイコン。
 *
 * **塗りだけで組んだ 24×24 のグリフ。** 24px のタイルの中に 16px で置く。
 * lucide は線（stroke）のセットで、塗りのアイコンを持っていないため、
 * ここだけ自前で用意している（`brand-icons.tsx` と同じ扱いの例外）。
 * 図形は矩形・円・多角形だけで作り、線幅の概念を持たせない。
 */
type IconProps = SVGProps<SVGSVGElement>;

function Glyph({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      {children}
    </svg>
  );
}

/** 画面のレイアウト。UIデザイン・情報設計 */
export function LayoutIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="3" width="8" height="18" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </Glyph>
  );
}

/**
 * `</>`。フロントエンド開発。
 * 山かっこだけだと 16px では左右の先端がくっついて菱形に見えるので、
 * 間にスラッシュを入れて3つの図形に分けている。
 */
export function CodeIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <polygon points="7,6.5 1.5,12 7,17.5 7,14.11 4.89,12 7,9.89" />
      <polygon points="9.19,18.31 11.41,18.89 14.81,5.69 12.59,5.11" />
      <polygon points="17,6.5 22.5,12 17,17.5 17,14.11 19.11,12 17,9.89" />
    </Glyph>
  );
}

/** 積み重なった層。バックエンド開発 */
export function StackIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="4" width="18" height="4" rx="2" />
      <rect x="3" y="10" width="18" height="4" rx="2" />
      <rect x="3" y="16" width="18" height="4" rx="2" />
    </Glyph>
  );
}

/** 右肩上がりの棒。施策立案 */
export function ChartIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3.5" y="14" width="4.5" height="7" rx="1.2" />
      <rect x="9.75" y="9" width="4.5" height="12" rx="1.2" />
      <rect x="16" y="4" width="4.5" height="17" rx="1.2" />
    </Glyph>
  );
}

/** きらめき。AI開発 */
export function SparkIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10Z" />
    </Glyph>
  );
}

/** 三点。その他 */
export function MoreIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </Glyph>
  );
}

export type SkillIcon = (props: IconProps) => React.JSX.Element;
