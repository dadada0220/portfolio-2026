import type { ReactNode } from "react";
import { Inbox, TriangleAlert } from "lucide-react";

export function EmptyState({
  variant = "empty",
  title,
  description,
  action,
}: {
  variant?: "empty" | "error";
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const Icon = variant === "error" ? TriangleAlert : Inbox;

  return (
    <div className="rounded-card flex flex-col items-center gap-2 border border-dashed bg-card px-6 py-12 text-center">
      <Icon aria-hidden className="size-[18px] text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      {description ? (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
