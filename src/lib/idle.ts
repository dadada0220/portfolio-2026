type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/**
 * ブラウザが空いてから実行する。
 * 初期描画やスクリプトの読み込みと帯域・メインスレッドを取り合わないための遅延。
 * 戻り値を呼ぶとキャンセルできる。
 */
export function runWhenIdle(task: () => void, timeout = 2000) {
  if (typeof window === "undefined") return () => {};

  const idleWindow = window as IdleWindow;

  if (idleWindow.requestIdleCallback) {
    const handle = idleWindow.requestIdleCallback(task, { timeout });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }

  const timer = window.setTimeout(task, Math.min(timeout, 1200));
  return () => window.clearTimeout(timer);
}
