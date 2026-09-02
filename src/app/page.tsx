import Link from "next/link";
import { Mail } from "lucide-react";

import { PageHeader, SectionHeading } from "@/components/page-header";
import { SkillItem } from "@/components/skill-item";
import { ViewAllLink } from "@/components/view-all-link";
import { WorkCard } from "@/components/work-card";
import { Button } from "@/components/ui/button";
import { intro, skills } from "@/lib/profile";
import { withLineBreaks } from "@/lib/text";
import { getWorks } from "@/lib/works";

export default async function HomePage() {
  const works = await getWorks();
  const recentWorks = works.slice(0, 3);

  return (
    <>
      <PageHeader
        size="hero"
        title={
          <>
            {intro.headline}
            <br />
            {/* <span className="text-muted-foreground">{intro.headlineMuted}</span> */}
            <span className="">{intro.headlineMuted}</span>
          </>
        }
        description={intro.body.map((line, index) => (
          <span key={index} className="block">
            {withLineBreaks(line)}
          </span>
        ))}
      />

      <section className="flex flex-col gap-5">
        <SectionHeading
          eyebrow="Works"
          title="最近の実績"
          description="これまでに携わった案件や成果物を掲載しています。"
          action={<ViewAllLink href="/works" />}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentWorks.map((work) => (
            <WorkCard key={work.slug} {...work} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeading
          eyebrow="Skills"
          title="できること"
          description="デザインや実装などのクリエイティブ業務や情報設計、施策立案やデータ分析、AIを用いた開発など幅広い領域に対応できます。"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillItem key={skill.title} {...skill} />
          ))}
        </div>
      </section>

      {/* <section className="surface-card relative overflow-hidden p-8 sm:p-10">
        <div
          aria-hidden
          className="bg-glow pointer-events-none absolute inset-0"
        />
        <div className="relative flex flex-col gap-3">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            相談したいことが決まっていなくても大丈夫です
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            「今のサイトの何を直すべきかわからない」という段階でも構いません。
            目的と現状をうかがったうえで、必要な進め方をご提案します。
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="brand" size="cta">
              <Link href="/contact">
                <Mail data-icon="inline-start" />
                お問い合わせ
              </Link>
            </Button>
            <Button asChild variant="outline" size="cta">
              <Link href="/works">実績を見る</Link>
            </Button>
          </div>
        </div>
      </section> */}
    </>
  );
}
