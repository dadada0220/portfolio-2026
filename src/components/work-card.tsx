import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  WORK_ROLE_LABELS,
  WORK_TYPE_LABELS,
  type WorkRole,
  type WorkType,
} from "@/lib/profile";

export type WorkCardProps = {
  slug: string;
  title: string;
  summary: string;
  type: WorkType;
  roles: WorkRole[];
  period: string;
};

export function WorkCard({
  slug,
  title,
  summary,
  type,
  roles,
  period,
}: WorkCardProps) {
  return (
    <Link
      href={`/works/${slug}`}
      className="group flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-colors outline-none hover:border-border-strong hover:bg-elevated focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{WORK_TYPE_LABELS[type]}</Badge>
          {roles.map((role) => (
            <Badge key={role} variant="outline">
              {WORK_ROLE_LABELS[role]}
            </Badge>
          ))}
        </div>
        <ArrowUpRight
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-[0.9375rem] font-bold tracking-tight underline-offset-4 group-hover:underline">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
      </div>

      <p className="mt-auto font-mono text-xs text-muted-foreground">
        {period}
      </p>
    </Link>
  );
}
