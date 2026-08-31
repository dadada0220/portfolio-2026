/**
 * サイドバーの開閉状態。
 * localStorage に持たせてリロードしても維持する。
 * `useSyncExternalStore` から読むので、エフェクト内での setState は不要。
 */
const STORAGE_KEY = "itd:sidebar-collapsed";

const listeners = new Set<() => void>();
let cached: boolean | null = null;

function read(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function subscribeSidebar(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function getSidebarCollapsed(): boolean {
  cached ??= read();
  return cached;
}

/** サーバー描画時は開いた状態を既定にする */
export function getSidebarCollapsedServer(): boolean {
  return false;
}

export function toggleSidebar() {
  cached = !getSidebarCollapsed();
  try {
    window.localStorage.setItem(STORAGE_KEY, cached ? "1" : "0");
  } catch {
    // プライベートモード等で書けなくても動作は続ける
  }
  for (const listener of listeners) listener();
}
