"use client";

import { LayoutGrid, List, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Tabs
          value={filters.category}
          onValueChange={(value) =>
            // カテゴリを変えるとタグの語彙も変わるので、選択中のタグは捨てる
            onChange({
              category: value as ArticleFilters["category"],
              tags: [],
            })
          }
        >
          <TabsList>
            <TabsTrigger value="all">すべて ({counts.all})</TabsTrigger>
            {ARTICLE_CATEGORIES.map((category) => (
              <TabsTrigger key={category} value={category}>
                {CATEGORY_LABELS[category]} ({counts[category]})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

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
            お気に入りのみ
          </Button>

          <ToggleGroup
            type="single"
            value={filters.view}
            onValueChange={(value) => {
              if (value) onChange({ view: value as ArticleFilters["view"] });
            }}
            variant="outline"
            size="sm"
            spacing={0}
            aria-label="表示形式"
          >
            <ToggleGroupItem value="list" aria-label="リスト表示">
              <List />
            </ToggleGroupItem>
            <ToggleGroupItem value="card" aria-label="カード表示">
              <LayoutGrid />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {filters.category === "all" ? (
        <p className="text-xs text-muted-foreground">
          カテゴリを選ぶとタグで絞り込めます（タグの語彙はカテゴリごとに異なります）。
        </p>
      ) : (
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
                  "inline-flex h-7 items-center rounded-md border px-2.5 text-xs transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "border-border-strong bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
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
