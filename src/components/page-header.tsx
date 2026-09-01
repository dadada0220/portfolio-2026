import type { ReactNode } from "react";

import { Breadcrumb } from "@/components/breadcrumb";
import { cn } from "@/lib/utils";

/**
 * セクションの頭に置く小さなラベル。グラデーションのドットで少しだけ色を差す。
 * **ページ見出しには使わない**（パンくずと同じことを言うため）。`SectionHeading` 専用。
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="pill inline-flex w-fit items-center gap-2 border bg-card py-1 pr-3 pl-2.5 text-xs font-medium text-muted-foreground shadow-sm">
      <span aria-hidden className="bg-brand size-1.5 rounded-full" />
      {children}
    </span>
  );
}

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** 詳細ページで、パンくずの末尾に出す現在地。指定すると親階層がリンクになる */
  breadcrumbCurrent?: ReactNode;
  /** hero はトップの導入部だけ。見出しを一段大きく、太くする */
  size?: "default" | "hero";
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbCurrent,
  size = "default",
  className,
}: PageHeaderProps) {
  const hero = size === "hero";

  return (
    <header className={cn("flex flex-col gap-4", className)}>
      <Breadcrumb current={breadcrumbCurrent} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className={cn("flex min-w-0 flex-col", hero ? "gap-4" : "gap-2")}>
          <h1
            className={cn(
              "min-w-0 tracking-tight",
              hero
                ? "text-3xl leading-[1.35] font-bold sm:text-[2.125rem]"
                : "text-2xl font-bold"
            )}
          >
            {title}
          </h1>

          {description ? (
            <p
              className={cn(
                "w-full text-muted-foreground",
                hero ? "text-sm leading-relaxed" : "text-sm"
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
