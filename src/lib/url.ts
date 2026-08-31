/** URL からホスト名を取り出す（`www.` は落とす）。不正なURLは null。 */
export function getDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** サムネイルが無いときのレターマーク用。ドメインまたはタイトルの頭文字。 */
export function getInitial(url: string | null | undefined, title: string) {
  const domain = getDomain(url);
  const source = domain ?? title;
  return (source.trim()[0] ?? "?").toUpperCase();
}

export function faviconUrl(url: string | null | undefined, size = 32) {
  const domain = getDomain(url);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

/** `2026-08-23T11:43:00.000Z` → `2026.08.23` */
export function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}
