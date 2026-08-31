import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { PageHeader, SectionHeading } from "@/components/page-header";
import { SkillItem } from "@/components/skill-item";
import { WorkCard } from "@/components/work-card";
import { Button } from "@/components/ui/button";
import { intro, skills } from "@/lib/profile";
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
            <span className="text-muted-foreground">{intro.headlineMuted}</span>
          </>
        }
        description={intro.body.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      />

      <section className="flex flex-col gap-5">
        <SectionHeading
          eyebrow="Works"
          title="直近の実績"
          description="担当した案件のうち、公開できるものを掲載しています。"
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/works">
                すべて見る
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          }
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
          description="デザインから実装、その後の改善まで。担当できる領域と、その深さ。"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {skills.map((skill) => (
            <SkillItem key={skill.title} {...skill} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm sm:p-10">
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
      </section>
    </>
  );
}
