"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <AlertTriangle className="mb-2 h-8 w-8 text-destructive" />
          <CardTitle>エラーが発生しました</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            {error.message || "予期しないエラーが発生しました。"}
          </p>
          <Button onClick={() => reset()}>もう一度試す</Button>
        </CardContent>
      </Card>
    </div>
  );
}
