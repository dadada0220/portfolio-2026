"use client";

import { LayoutGrid, List, Star, X } from "lucide-react";

import { Segmented, type SegmentedItem } from "@/components/segmented";
import { Button } from "@/components/ui/button";
import { ARTICLE_CATEGORIES, CATEGORY_LABELS } from "@/lib/articles";
import type { ArticleCategory } from "@/lib/articles";
import { cn } from "@/lib/utils";

export type ArticleFilters = {
  category: ArticleCategory | "all";
  view: "list" | "card";
  starred: boolean;
  tags: string[];
};

export function ArticleToolbar({
  filters,
  tagOptions,
  counts,
  resultCount,
  onChange,
}: {
  filters: ArticleFilters;
  /** 選択中カテゴリのタグ語彙（出現数の多い順） */
  tagOptions: string[];
  counts: Record<ArticleCategory | "all", number>;
  /** 全件の読み込み待ちのときは null */
  resultCount: number | null;
  onChange: (next: Partial<ArticleFilters>) => void;
}) {
  const toggleTag = (tag: string) => {
    onChange({
      tags: filters.tags.includes(tag)
        ? filters.tags.filter((t) => t !== tag)
        : [...filters.tags, tag],
    });
  };

  const categoryItems: SegmentedItem[] = [
    { value: "all", label: `すべて（${counts.all}）` },
    ...ARTICLE_CATEGORIES.map((category) => ({
      value: category,
      label: `${CATEGORY_LABELS[category]}（${counts[category]}）`,
    })),
  ];

  const viewItems: SegmentedItem[] = [
    { value: "card", label: <LayoutGrid aria-label="カード表示" className="size-3.5" /> },
    { value: "list", label: <List aria-label="リスト表示" className="size-3.5" /> },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          items={categoryItems}
          value={filters.category}
          label="カテゴリで絞り込み"
          // カテゴリを変えるとタグの語彙も変わるので、選択中のタグは捨てる
          onSelect={(value) =>
            onChange({
              category: value as ArticleFilters["category"],
              tags: [],
            })
          }
        />

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={filters.starred ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={filters.starred}
            onClick={() => onChange({ starred: !filters.starred })}
          >
            <Star
              data-icon="inline-start"
              className={cn(filters.starred && "fill-star text-star")}
            />
            おすすめのみ
          </Button>

          <Segmented
            items={viewItems}
            value={filters.view}
            label="表示形式"
            onSelect={(value) =>
              onChange({ view: value as ArticleFilters["view"] })
            }
          />
        </div>
      </div>

      {filters.category === "all" ? null : (
        <div className="flex flex-wrap items-center gap-1.5">
          {tagOptions.map((tag) => {
            const active = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => toggleTag(tag)}
                className={cn(
                  // 太さは選択状態で変えない。幅が動いてタグが折り返してしまうため
                  "inline-flex h-7 cursor-pointer items-center rounded-md border px-2.5 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tag}
              </button>
            );
          })}
          {filters.tags.length > 0 ? (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onChange({ tags: [] })}
            >
              <X data-icon="inline-start" />
              タグをクリア
            </Button>
          ) : null}
        </div>
      )}

      <p className="font-mono text-xs text-muted-foreground">
        {resultCount === null ? "読み込み中…" : `${resultCount} 件`}
      </p>
    </div>
  );
}
