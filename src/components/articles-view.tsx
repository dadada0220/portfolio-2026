"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { ArticleCard } from "@/components/article-card";
import { ArticleDialog } from "@/components/article-dialog";
import { ArticleRow } from "@/components/article-row";
import {
  ArticleToolbar,
  type ArticleFilters,
} from "@/components/article-toolbar";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ARTICLE_CATEGORIES,
  CATEGORY_LABELS,
  type Article,
  type ArticleCategory,
  type ArticleFacets,
} from "@/lib/articles";
import { runWhenIdle } from "@/lib/idle";
import { prefetchThumbsWhenIdle } from "@/lib/thumb";

/** 一度に描画する件数。600件超あるので少しずつ足す。 */
const PAGE_SIZE = 60;

/**
 * リスト表示のとき、先頭から何件分のサムネイルをアイドル時間に先読みするか。
 * 詳細モーダルの画像を待たせないための保険。全件やると無駄な通信になるので上から数件だけ。
 */
const IDLE_PREFETCH_COUNT = 12;

type ViewState = ArticleFilters & {
  /** 詳細を開いている記事のID。URLの `?article=` と同期する */
  article: string | null;
};

function parseState(search: string): ViewState {
  const params = new URLSearchParams(search);
  const cat = params.get("cat");
  return {
    category: ARTICLE_CATEGORIES.find((c) => c === cat) ?? "all",
    // 既定はカード表示。リストのときだけURLに残す
    view: params.get("view") === "list" ? "list" : "card",
    starred: params.get("star") === "1",
    tags: (params.get("tags") ?? "").split(",").filter(Boolean),
    article: params.get("article"),
  };
}

function toQuery(state: ViewState): string {
  const params = new URLSearchParams();
  if (state.category !== "all") params.set("cat", state.category);
  if (state.view !== "card") params.set("view", state.view);
  if (state.starred) params.set("star", "1");
  if (state.tags.length > 0) params.set("tags", state.tags.join(","));
  if (state.article) params.set("article", state.article);
  const query = params.toString();
  return query ? `?${query}` : "";
}

/* ------------------------------------------------------------------ *
 * 画面の状態はURLのクエリを唯一の情報源にする。
 * 更新は History API で行い、Next.js のルート遷移を起こさない
 * （＝絞り込み・表示切替・詳細を開く操作に通信も再レンダー待ちも発生しない）。
 * ------------------------------------------------------------------ */

const urlListeners = new Set<() => void>();

function notifyUrlChange() {
  for (const listener of urlListeners) listener();
}

function subscribeToUrl(onChange: () => void) {
  urlListeners.add(onChange);
  // 戻る / 進むは popstate から拾う
  window.addEventListener("popstate", onChange);
  return () => {
    urlListeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
}

const getUrlSearch = () => window.location.search;
// サーバー描画時はクエリ無しとして扱う。
// こうすると一覧がHTMLに含まれ、`/articles` を開いた瞬間に記事が見える
const getServerUrlSearch = () => "";

function useUrlState(): ViewState {
  const search = useSyncExternalStore(
    subscribeToUrl,
    getUrlSearch,
    getServerUrlSearch
  );
  return useMemo(() => parseState(search), [search]);
}

function ListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <ul className="surface-card overflow-hidden">
      {Array.from({ length: rows }).map((_, index) => (
        <li
          key={index}
          className="flex items-start gap-3 border-b py-3 pr-11 pl-3 last:border-b-0"
        >
          <Skeleton className="mt-0.5 size-4 shrink-0 rounded-sm" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ArticlesView({
  initialArticles,
  facets,
  failedCategories,
}: {
  /** HTMLに載っている先頭分。残りは必要になってから取りに行く */
  initialArticles: Article[];
  /** 件数とタグの語彙。全件から集計済みなので最初から正しい値が出る */
  facets: ArticleFacets;
  failedCategories: ArticleCategory[];
}) {
  const state = useUrlState();

  const commit = useCallback((next: ViewState, mode: "push" | "replace") => {
    const url = `${window.location.pathname}${toQuery(next)}`;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
    notifyUrlChange();
  }, []);

  const updateFilters = (next: Partial<ArticleFilters>) => {
    // 絞り込みの1操作ずつが履歴に積まれると「戻る」が使いづらいので replace
    commit({ ...state, ...next }, "replace");
  };

  const pushedDialog = useRef(false);

  const openDetail = (article: Article) => {
    pushedDialog.current = true;
    commit({ ...state, article: article.id }, "push");
  };

  const closeDetail = () => {
    if (pushedDialog.current) {
      pushedDialog.current = false;
      // popstate 経由で state が戻るので、閉じる操作と「戻る」の結果が一致する
      window.history.back();
      return;
    }
    commit({ ...state, article: null }, "replace");
  };

  /**
   * 全件はHTMLに載せず、必要になってから取得する。
   * - 既定の並びを眺めているだけなら、ブラウザが空いた時間に静かに取りに行く
   * - 絞り込みや「もっと見る」で全件が要るときは、その場で取りに行く
   */
  const [articles, setArticles] = useState(initialArticles);
  const [loadFailed, setLoadFailed] = useState(false);
  const hasAll = articles.length >= facets.counts.all;
  const requested = useRef(false);

  const loadAll = useCallback(() => {
    if (requested.current) return;
    requested.current = true;

    fetch("/api/articles")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<{ articles: Article[] }>;
      })
      .then(({ articles: all }) => setArticles(all))
      .catch((error: unknown) => {
        console.error("[articles] 全件の取得に失敗しました", error);
        // 取得できなくても先頭分は表示できているので、そのまま使い続ける
        setLoadFailed(true);
      });
  }, []);

  const counts = facets.counts;
  const tagOptions =
    state.category === "all" ? [] : facets.tagsByCategory[state.category];

  const visible = useMemo(() => {
    return articles.filter((article) => {
      if (state.category !== "all" && article.category !== state.category) {
        return false;
      }
      if (state.starred && !article.starred) return false;
      if (
        state.tags.length > 0 &&
        !state.tags.some((tag) => article.tags.includes(tag))
      ) {
        return false;
      }
      return true;
    });
  }, [articles, state.category, state.starred, state.tags]);

  // 絞り込みが変わったら表示件数を戻す
  const filterKey = `${state.category}|${state.starred}|${state.tags.join(",")}`;
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setLimit(PAGE_SIZE);
  }

  const filtering =
    state.category !== "all" || state.starred || state.tags.length > 0;

  // 絞り込み中、または初期表示分を超えて見ようとしているときは全件が要る
  const needsAll = filtering || limit > initialArticles.length;

  useEffect(() => {
    if (hasAll || loadFailed) return;
    if (needsAll) {
      loadAll();
      return;
    }
    return runWhenIdle(loadAll);
  }, [hasAll, loadFailed, needsAll, loadAll]);

  /**
   * 絞り込み中に全件が揃っていないと、結果そのものが誤りになる（該当記事がまだ手元に無い）。
   * その場合だけスケルトンに切り替える。
   * 「もっと見る」の途中なら、いま出ている分は正しいのでそのまま残す。
   */
  const waitingForAll = filtering && !hasAll && !loadFailed;

  const shown = visible.slice(0, limit);

  // 未取得のときは全件数（サーバーで集計済み）を正とする
  const total = hasAll || filtering ? visible.length : facets.counts.all;
  const canShowMore = shown.length < total;
  const loadingMore =
    canShowMore && !hasAll && !loadFailed && shown.length >= articles.length;

  /**
   * リストではサムネイルを描画しないので、詳細を開いたときだけ画像の読み込みが始まってしまう。
   * 一覧の描画が終わってブラウザが空いたタイミングで、上位数件だけ先に温めておく
   * （カード表示は Thumbnail が同じURLで読むので不要）。
   */
  const idlePrefetchIds = shown
    .slice(0, IDLE_PREFETCH_COUNT)
    .map((article) => article.id)
    .join(",");

  useEffect(() => {
    if (state.view !== "list" || !idlePrefetchIds) return;
    return prefetchThumbsWhenIdle(idlePrefetchIds.split(","));
  }, [state.view, idlePrefetchIds]);

  const openedArticle = useMemo(
    () => articles.find((article) => article.id === state.article) ?? null,
    [articles, state.article]
  );

  const allFailed = failedCategories.length === ARTICLE_CATEGORIES.length;

  return (
    <div className="flex flex-col gap-4">
      <ArticleToolbar
        filters={state}
        tagOptions={tagOptions}
        counts={counts}
        resultCount={waitingForAll ? null : total}
        onChange={updateFilters}
      />

      {failedCategories.length > 0 && !allFailed ? (
        <p className="rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
          {failedCategories.map((c) => CATEGORY_LABELS[c]).join(" / ")}{" "}
          の取得に失敗したため、一部の記事が表示されていません。
        </p>
      ) : null}

      {allFailed ? (
        <EmptyState
          variant="error"
          title="記事を取得できませんでした"
          description="Notion API への接続に失敗しています。しばらく時間をおいてから再度お試しください。"
        />
      ) : waitingForAll ? (
        <ListSkeleton />
      ) : visible.length === 0 ? (
        <EmptyState
          title="条件に合う記事がありません"
          description="タグやおすすめの絞り込みを外すと表示されます。"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilters({ tags: [], starred: false })}
            >
              絞り込みをクリア
            </Button>
          }
        />
      ) : state.view === "card" ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((article) => (
            <li key={article.id} className="flex">
              <ArticleCard article={article} onOpenDetail={openDetail} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="surface-card overflow-hidden">
          {shown.map((article) => (
            <ArticleRow
              key={article.id}
              article={article}
              onOpenDetail={openDetail}
            />
          ))}
        </ul>
      )}

      {!waitingForAll && canShowMore ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            disabled={loadingMore}
            onClick={() => setLimit((current) => current + PAGE_SIZE)}
          >
            {loadingMore
              ? "読み込み中…"
              : `もっと見る（残り ${total - shown.length} 件）`}
          </Button>
        </div>
      ) : null}

      <ArticleDialog article={openedArticle} onClose={closeDetail} />
    </div>
  );
}
