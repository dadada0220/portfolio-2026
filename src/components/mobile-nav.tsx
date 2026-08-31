"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { SideNavContent } from "@/components/side-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { site } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="メニューを開く"
          className="shrink-0 lg:hidden"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-4">
        <SheetTitle className="sr-only">サイト内ナビゲーション</SheetTitle>
        <SheetDescription className="sr-only">
          {site.name}のサイトの各ページへ移動します。
        </SheetDescription>
        <SideNavContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
