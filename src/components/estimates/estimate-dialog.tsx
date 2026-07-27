"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Estimate, EstimateStatus } from "@/lib/mock-data";
import { useData } from "@/lib/data-context";

const statusOptions: EstimateStatus[] = ["作成中", "提出済み", "承認", "却下"];

function buildForm(estimate?: Estimate, defaultProjectId?: string) {
  return {
    projectId: estimate?.projectId ?? defaultProjectId ?? "",
    title: estimate?.title ?? "",
    amount: estimate?.amount?.toString() ?? "",
    itemCount: estimate?.itemCount?.toString() ?? "",
    status: estimate?.status ?? ("作成中" as EstimateStatus),
    validUntil: estimate?.validUntil ?? "",
  };
}

export function EstimateDialog({
  estimate,
  defaultProjectId,
}: {
  estimate?: Estimate;
  defaultProjectId?: string;
}) {
  const { projects, addEstimate, updateEstimate } = useData();
  const isEdit = Boolean(estimate);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(buildForm(estimate, defaultProjectId));

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    setForm(buildForm(estimate, defaultProjectId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find((p) => p.id === form.projectId);
    if (!project) return;
    const payload = {
      projectId: form.projectId,
      customerId: project.customerId,
      title: form.title,
      amount: Number(form.amount) || 0,
      itemCount: Number(form.itemCount) || 0,
      status: form.status,
      validUntil: form.validUntil,
      taxIncluded: true,
    };
    if (isEdit && estimate) {
      updateEstimate(estimate.id, payload);
    } else {
      addEstimate(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil />
            </Button>
          ) : (
            <Button size="sm">
              <Plus />
              新規見積作成
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? "見積もりを編集" : "新規見積作成"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label>関連案件</Label>
              <Select
                value={form.projectId}
                onValueChange={(v) => setForm({ ...form, projectId: v ?? "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="e-title">件名</Label>
              <Input
                id="e-title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-amount">金額(円)</Label>
              <Input
                id="e-amount"
                type="number"
                required
                min={0}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-items">項目数</Label>
              <Input
                id="e-items"
                type="number"
                required
                min={0}
                value={form.itemCount}
                onChange={(e) => setForm({ ...form, itemCount: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>ステータス</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: (v as EstimateStatus) ?? "作成中" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-valid">有効期限</Label>
              <Input
                id="e-valid"
                type="date"
                required
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!form.projectId}>
              {isEdit ? "保存" : "作成"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
