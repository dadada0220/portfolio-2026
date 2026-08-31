import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageHeader
      eyebrow="404"
      title="ページが見つかりません"
      description="URLが変更されたか、削除された可能性があります。"
      actions={
        <Button asChild variant="outline" size="sm">
          <Link href="/">トップへ戻る</Link>
        </Button>
      }
    />
  );
}
