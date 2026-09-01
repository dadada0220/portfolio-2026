import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "お仕事のご相談・ご質問はこちらからお送りください。",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="お問い合わせ"
        description="お仕事のご相談・ご質問はこちらからお送りください。3営業日以内にご返信します。"
      />

      <ContactForm />

      <p className="text-sm text-muted-foreground">
        フォームがうまく動かない場合は{" "}
        <a
          href={`mailto:${site.email}`}
          className="text-foreground underline underline-offset-4"
        >
          {site.email}
        </a>{" "}
        まで直接ご連絡ください。
      </p>
    </>
  );
}
