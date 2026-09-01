import type { Metadata } from "next";

import { PageHeader, SectionHeading } from "@/components/page-header";
import { Timeline } from "@/components/timeline";
import { timeline } from "@/lib/profile";
import { company, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name}の会社概要と略歴。`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title="事務所について" />

      <section className="flex flex-col gap-5">
        <SectionHeading eyebrow="Profile" title="概要" />
        <dl className="surface-card divide-y overflow-hidden">
          {company.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 p-5 sm:flex-row sm:gap-6"
            >
              <dt className="shrink-0 text-sm font-bold sm:w-32">
                {row.label}
              </dt>
              <dd className="flex min-w-0 flex-col gap-0.5 text-sm leading-relaxed text-muted-foreground">
                {row.lines.map((line) =>
                  row.label === "連絡先" ? (
                    <a
                      key={line}
                      href={`mailto:${line}`}
                      className="w-fit text-foreground underline underline-offset-4"
                    >
                      {line}
                    </a>
                  ) : (
                    <span key={line}>{line}</span>
                  )
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeading
          eyebrow="Career"
          title="略歴"
          description="代表がこれまでに在籍した組織と、担当してきた役割。"
        />
        <div className="surface-card p-6">
          <Timeline items={timeline} />
        </div>
      </section>
    </>
  );
}
