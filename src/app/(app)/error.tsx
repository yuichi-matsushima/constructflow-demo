"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-7 text-destructive" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold tracking-tight">
          エラーが発生しました
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          データの読み込みまたは処理中に問題が発生しました。時間をおいて再度お試しください。
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            エラーID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => unstable_retry()}>再試行</Button>
        <Button variant="outline" render={<Link href="/">ダッシュボードに戻る</Link>} />
      </div>
    </div>
  );
}
