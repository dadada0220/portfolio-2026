import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { WorkCard } from "@/components/work-card";
import { WorkTypeFilter } from "@/components/work-type-filter";
import { Button } from "@/components/ui/button";
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
        eyebrow="Works"
        title="実績"
        description="公開できるものは実名で、クライアントワークは案件名をぼかして掲載しています。各ページは「課題 → 取り組み → 成果」の順に書いています。"
      />

      <section className="flex flex-col gap-4">
        <WorkTypeFilter active={activeType} counts={counts} />

        {visible.length === 0 ? (
          <EmptyState
            title={`「${activeType ? WORK_TYPE_LABELS[activeType] : ""}」の実績はまだありません`}
            description="他の種別の実績をご覧ください。"
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/works">すべての実績を見る</Link>
              </Button>
            }
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
