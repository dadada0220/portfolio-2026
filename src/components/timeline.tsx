import type { ReactNode } from "react";

import { withLineBreaks } from "@/lib/text";

export function Timeline({
  items,
}: {
  items: { period: string; title: string; description: ReactNode }[];
}) {
  return (
    <ol className="flex flex-col">
      {items.map((item, index) => (
        <li key={item.title} className="flex gap-4">
          {/* 縦線と丸で時系列を示す。最後の項目だけ線を伸ばさない */}
          <div
            aria-hidden
            className="flex w-3 shrink-0 flex-col items-center pt-1.5"
          >
            <span className="bg-brand size-2 shrink-0 rounded-full" />
            {index < items.length - 1 ? (
              <span className="w-px flex-1 bg-border" />
            ) : null}
          </div>
          <div className="flex flex-col gap-1 pb-6 last:pb-0">
            <p className="font-mono text-xs text-muted-foreground">
              {item.period}
            </p>
            <h3 className="text-[0.9375rem] font-bold tracking-tight">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {withLineBreaks(item.description)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
