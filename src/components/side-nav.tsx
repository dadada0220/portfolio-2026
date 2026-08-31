"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft, PanelLeftClose } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleSidebar } from "@/lib/sidebar-store";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * サイドバーの寸法。
 *
 * 中身は畳んでも `w-60`（=240px）のまま描画し、外側の `aside` の幅だけを変える。
 * こうすると開閉中に中身が再レイアウトされないので、
 * 「一瞬だけ幅が狭くなって大量に改行される」状態が起きない。はみ出た分は `aside` が切り取る。
 *
 * 畳んだ幅 `w-16`(64px) は、ナビのアイコン中心（16px padding + 8px padding + 15px/2 ≒ 31.5px）と
 * レールの中心（32px）が一致するように決めている。
 * 開閉ボタン（32px）も左のラベル枠を 0 幅にすると中心 32px に来るので、
 * **開閉ボタンとナビのアイコンは畳んでも縦にも横にも動かない。**
 */
const RAIL_WIDTH = "w-16";
const OPEN_WIDTH = "w-60";
/** `aside` の内側（240px - 左右の padding 16px×2） */
const CONTENT_WIDTH = "w-52";
/** 見出しを収める枠。ここを 0 にすると開閉ボタンがレールの中心へ来る */
const LABEL_SLOT_WIDTH = "w-44";

/** 開閉に合わせて出し入れする要素の共通トランジション */
function fade(collapsed: boolean) {
  return cn(
    "transition-opacity duration-150 motion-reduce:transition-none",
    collapsed ? "opacity-0" : "opacity-100 delay-150"
  );
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SideNavContent({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-3 whitespace-nowrap">
      {/* 見出しと開閉ボタン。畳むと見出しの枠が 0 幅になり、ボタンだけがレールに残る */}
      <div className="flex h-8 items-center">
        <div
          className={cn(
            "overflow-hidden transition-[width] duration-300 ease-out motion-reduce:transition-none",
            collapsed ? "w-0" : LABEL_SLOT_WIDTH
          )}
        >
          <p
            aria-hidden={collapsed}
            className={cn(
              "px-2 text-[0.6875rem] font-bold tracking-[0.08em] text-muted-foreground/70 uppercase",
              fade(collapsed)
            )}
          >
            Menu
          </p>
        </div>

        {onNavigate ? null : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label={
                  collapsed ? "サイドバーを開く" : "サイドバーを閉じる"
                }
                aria-expanded={!collapsed}
                className="shrink-0 text-muted-foreground"
              >
                {collapsed ? <PanelLeft /> : <PanelLeftClose />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "サイドバーを開く" : "サイドバーを閉じる"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <nav aria-label="サイト内ナビゲーション" className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-2.5 overflow-hidden rounded-md px-2 py-1.5 text-sm outline-none",
                    "transition-[width,background-color,color] duration-300 ease-out motion-reduce:transition-none",
                    "focus-visible:ring-3 focus-visible:ring-ring/50",
                    collapsed ? "w-8" : CONTENT_WIDTH,
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon
                    aria-hidden
                    className={cn(
                      "size-[15px] shrink-0",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className={fade(collapsed)}>{item.label}</span>
                </Link>
              </TooltipTrigger>
              {collapsed ? (
                <TooltipContent side="right">{item.label}</TooltipContent>
              ) : null}
            </Tooltip>
          );
        })}
      </nav>

      <div
        aria-hidden={collapsed}
        className={cn(
          "mt-auto flex flex-col gap-0.5 rounded-lg border bg-card p-3",
          CONTENT_WIDTH,
          collapsed && "pointer-events-none",
          fade(collapsed)
        )}
      >
        <p className="text-xs font-bold">{site.name}</p>
        <p className="font-mono text-[0.6875rem] text-muted-foreground">
          {site.role}
        </p>
      </div>
    </div>
  );
}

export function SideNav({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        // ヘッダー(h-14)の下に貼り付く
        "sticky top-14 hidden h-[calc(100svh-3.5rem)] shrink-0 overflow-hidden border-r bg-sidebar lg:block",
        "transition-[width] duration-300 ease-out motion-reduce:transition-none",
        collapsed ? RAIL_WIDTH : OPEN_WIDTH
      )}
    >
      {/* 中身は常に開いた幅で描画する（畳んでも再レイアウトさせない） */}
      <div className={cn("h-full p-4", OPEN_WIDTH)}>
        <SideNavContent collapsed={collapsed} />
      </div>
    </aside>
  );
}
