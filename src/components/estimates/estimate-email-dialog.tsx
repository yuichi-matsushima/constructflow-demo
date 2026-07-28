"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Customer, Estimate, formatCurrency } from "@/lib/mock-data";
import { sendEstimateEmail } from "@/app/(app)/estimates/actions";

function buildBody(estimate: Estimate, customerName: string) {
  return `${customerName} 様

いつもお世話になっております。
ご依頼いただきました下記見積書をお送りいたします。

件名: ${estimate.title}
見積番号: ${estimate.estimateCode}
金額: ${formatCurrency(estimate.amount)}(税込)
有効期限: ${estimate.validUntil}

ご不明な点がございましたらお気軽にお問い合わせください。
何卒よろしくお願いいたします。

ConstructFlow`;
}

export function EstimateEmailDialog({
  estimate,
  customer,
}: {
  estimate: Estimate;
  customer: Customer | undefined;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ to: string; at: string } | null>(null);
  const [to, setTo] = useState(customer?.email ?? "");
  const [subject, setSubject] = useState(
    `【ConstructFlow】御見積書のご送付(${estimate.estimateCode})`
  );
  const [body, setBody] = useState(
    buildBody(estimate, customer?.name ?? "お客様")
  );

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    setError(null);
    setSent(null);
    setTo(customer?.email ?? "");
    setSubject(`【ConstructFlow】御見積書のご送付(${estimate.estimateCode})`);
    setBody(buildBody(estimate, customer?.name ?? "お客様"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await sendEstimateEmail(estimate.id, { to, subject, body });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent({ to: result.data.sentTo, at: result.data.sentAt });
      router.refresh();
    } catch {
      setError("送信中にエラーが発生しました");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleOpenChange(true)}
        aria-label="見積書をメール送信"
        title="見積書をメール送信"
      >
        <Mail />
      </Button>
      <DialogContent className="sm:max-w-lg">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <p className="font-medium">送信しました(モック)</p>
            <p className="text-sm text-muted-foreground">
              {sent.to} 宛に送信したものとして記録しました。
            </p>
            <DialogFooter className="w-full">
              <Button className="w-full" onClick={() => setOpen(false)}>
                閉じる
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>見積書をメール送信</DialogTitle>
            </DialogHeader>

            <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              ※これはデモ用のモック送信です。実際にメールは送信されません。送信記録のみ保存されます。
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mail-to">宛先</Label>
                <Input
                  id="mail-to"
                  type="email"
                  required
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mail-subject">件名</Label>
                <Input
                  id="mail-subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mail-body">本文</Label>
                <Textarea
                  id="mail-body"
                  required
                  rows={10}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "送信中…" : "送信する"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
