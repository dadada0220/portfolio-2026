"use client";

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Mail, Moon } from "lucide-react";

import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { SideNav } from "@/components/side-nav";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getSidebarCollapsed,
  getSidebarCollapsedServer,
  subscribeSidebar,
} from "@/lib/sidebar-store";
import { externalLinks } from "@/lib/site";

/** メインコンテンツの左右余白。PCでは 40px 固定で、中央寄せの最大幅は取らない。 */
const GUTTER = "px-4 sm:px-6 lg:px-10";

/**
 * ヘッダーの左右余白。
 * 左はサイドバーの内側（`p-4` = 16px）に合わせてロゴを縦のラインに乗せ、
 * 右はコンテンツの余白に合わせる。
 */
const HEADER_GUTTER = "px-4 sm:px-6 lg:pl-4 lg:pr-10";

export function AppShell({ children }: { children: ReactNode }) {
  const collapsed = useSyncExternalStore(
    subscribeSidebar,
    getSidebarCollapsed,
    getSidebarCollapsedServer
  );

  return (
    <div className="bg-surface-gradient flex min-h-svh flex-col">
      {/* ヘッダーはサイドバーの上を通して画面幅いっぱいに置く */}
      <header
        className={`sticky top-0 z-40 flex h-14 w-full shrink-0 items-center gap-3 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70 ${HEADER_GUTTER}`}
      >
        <MobileNav />

        <Link
          href="/"
          className="shrink-0 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Logo className="h-8 w-auto max-w-none" />
        </Link>

        <div className="ml-auto flex items-center gap-1">
          {externalLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Tooltip key={link.href}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-sm"
                    className="hidden text-muted-foreground sm:inline-flex"
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={link.label}
                    >
                      <Icon />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{link.label}</TooltipContent>
              </Tooltip>
            );
          })}

          {/* ダークモードは色の検討中。導線だけ先に置いてある */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="ダークモード（準備中）"
                className="ml-2 text-muted-foreground"
              >
                <Moon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              ダークモード（準備中）
            </TooltipContent>
          </Tooltip>

          <Button asChild variant="brand" size="cta" className="ml-2">
            <Link href="/contact">
              <Mail data-icon="inline-start" />
              <span className="hidden sm:inline">お問い合わせ</span>
              <span className="sm:hidden">問い合わせ</span>
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <SideNav collapsed={collapsed} />

        <main className="relative min-w-0 flex-1">
          {/* ページ上部にだけ淡いにじみを敷く。要素そのものには色を乗せない */}
          <div
            aria-hidden
            className="bg-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          />
          <div
            className={`relative flex w-full flex-col gap-12 py-8 sm:py-10 ${GUTTER}`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
