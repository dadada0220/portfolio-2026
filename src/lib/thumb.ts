import { runWhenIdle } from "@/lib/idle";

/**
 * サムネイルのURLは必ずここを通す。
 * 一覧のカードと詳細モーダルで**同じURL**を使うことで、ブラウザキャッシュが効き、
 * モーダルを開いたときに画像を取り直さずに済む。
 */
export function thumbUrl(pageId: string) {
  return `/api/thumb/${pageId}`;
}

const prefetched = new Set<string>();

/**
 * サムネイルを先読みする。
 * リスト表示では画像を出していないので、詳細を開く意図が見えた時点
 * （ボタンにホバー / フォーカス / 押下）と、描画が落ち着いたアイドル時間に先読みしておく。
 */
export function prefetchThumb(pageId: string) {
  if (typeof window === "undefined" || prefetched.has(pageId)) return;
  prefetched.add(pageId);

  const image = new window.Image();
  image.decoding = "async";
  image.src = thumbUrl(pageId);
}

/**
 * 一覧の描画とReactの初期化が終わってから先読みを始める。
 * メインコンテンツの読み込みと帯域を取り合わないようにするための遅延。
 */
export function prefetchThumbsWhenIdle(pageIds: string[]) {
  return runWhenIdle(() => {
    for (const pageId of pageIds) prefetchThumb(pageId);
  }, 3000);
}
