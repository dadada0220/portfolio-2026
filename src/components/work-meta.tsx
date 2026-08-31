import {
  WORK_ROLE_LABELS,
  WORK_TYPE_LABELS,
  type WorkRole,
  type WorkType,
} from "@/lib/profile";

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card p-4 shadow-sm">
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
  roles: WorkRole[];
  stack: string[];
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      <Cell label="種別" value={WORK_TYPE_LABELS[type]} />
      <Cell
        label="関与範囲"
        value={roles.map((role) => WORK_ROLE_LABELS[role]).join(" / ")}
      />
      <Cell label="スタック" value={stack.length > 0 ? stack.join(", ") : "—"} />
    </dl>
  );
}
