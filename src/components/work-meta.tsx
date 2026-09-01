import { WORK_TYPE_LABELS, type WorkType } from "@/lib/profile";

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card flex flex-col gap-1 p-4">
      <dt className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export function WorkMeta({
  type,
  roles,
  stack,
}: {
  type: WorkType;
  /** md にそのまま書いた文字列。コード側にマスタは持たない */
  roles: string[];
  stack: string[];
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      <Cell label="種別" value={WORK_TYPE_LABELS[type]} />
      <Cell label="領域" value={roles.join(" / ")} />
      <Cell label="スタック" value={stack.length > 0 ? stack.join(", ") : "—"} />
    </dl>
  );
}
