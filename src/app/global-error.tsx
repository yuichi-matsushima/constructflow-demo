"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body className="flex min-h-screen items-center justify-center bg-white p-6 text-slate-900">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-lg font-semibold">エラーが発生しました</h1>
          <p className="text-sm text-slate-500">
            {error.message || "予期しないエラーが発生しました。"}
          </p>
          <button
            onClick={() => reset()}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
          >
            もう一度試す
          </button>
        </div>
      </body>
    </html>
  );
}
