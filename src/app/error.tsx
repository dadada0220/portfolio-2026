"use client";

import { useEffect } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageHeader
      eyebrow="Error"
      title="表示中に問題が発生しました"
      description="時間をおいて、もう一度お試しください。"
      actions={
        <Button variant="outline" size="sm" onClick={reset}>
          再読み込み
        </Button>
      }
    />
  );
}
