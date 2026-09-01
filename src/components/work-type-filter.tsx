import { Segmented, type SegmentedItem } from "@/components/segmented";
import { WORK_TYPE_LABELS, WORK_TYPES, type WorkType } from "@/lib/profile";

/**
 * 実績一覧の種別フィルタ。
 * 状態はURL（`/works?type=web-service`）に持たせるのでリンクで組む（クライアントJS不要）。
 * 実績が1件も無い種別はセグメントに出さない。
 */
export function WorkTypeFilter({
  active,
  counts,
}: {
  active?: WorkType;
  counts: Record<WorkType, number>;
}) {
  const items: SegmentedItem[] = [
    { value: "all", label: "すべて", href: "/works" },
    ...WORK_TYPES.filter((type) => counts[type] > 0).map((type) => ({
      value: type,
      label: WORK_TYPE_LABELS[type],
      href: `/works?type=${type}`,
    })),
  ];

  return <Segmented items={items} value={active ?? "all"} label="種別で絞り込み" />;
}
