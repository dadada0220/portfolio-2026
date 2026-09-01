import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ViewAllLink } from "@/components/view-all-link";
import { WorkCard } from "@/components/work-card";
import { WorkTypeFilter } from "@/components/work-type-filter";
import { WORK_TYPES, WORK_TYPE_LABELS, type WorkType } from "@/lib/profile";
import { getWorks } from "@/lib/works";

export const metadata: Metadata = {
  title: "Works",
  description:
    "コーポレートサイトからWebサービス・管理画面まで、担当した実績の一覧。",
};

function parseType(value: string | string[] | undefined): WorkType | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  return WORK_TYPES.find((type) => type === first);
}

export default async function WorksPage({
  searchParams,
}: PageProps<"/works">) {
  const works = await getWorks();
  const activeType = parseType((await searchParams).type);

  const counts = Object.fromEntries(
    WORK_TYPES.map((type) => [type, works.filter((w) => w.type === type).length])
  ) as Record<WorkType, number>;

  const visible = activeType
    ? works.filter((work) => work.type === activeType)
    : works;

  return (
    <>
      <PageHeader
        title="実績"
        description="これまでに携わった案件や成果物を掲載しています。"
      />

      <section className="flex flex-col gap-4">
        <WorkTypeFilter active={activeType} counts={counts} />

        {visible.length === 0 ? (
          <EmptyState
            title={`「${activeType ? WORK_TYPE_LABELS[activeType] : ""}」の実績はまだありません`}
            description="他の種別の実績をご覧ください。"
            action={<ViewAllLink href="/works" />}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {visible.map((work) => (
              <WorkCard key={work.slug} {...work} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
