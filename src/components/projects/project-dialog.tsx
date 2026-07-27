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
import {
  ConstructionType,
  Project,
  ProjectStatus,
  staff,
} from "@/lib/mock-data";
import { useData } from "@/lib/data-context";

const statusOptions: ProjectStatus[] = [
  "商談中",
  "契約済み",
  "設計中",
  "施工中",
  "完了",
];
const typeOptions: ConstructionType[] = ["新築", "リフォーム", "増築", "店舗改装"];

function buildForm(project?: Project) {
  return {
    name: project?.name ?? "",
    customerId: project?.customerId ?? "",
    status: project?.status ?? ("商談中" as ProjectStatus),
    constructionType: project?.constructionType ?? ("新築" as ConstructionType),
    budget: project?.budget?.toString() ?? "",
    floorAreaSqm: project?.floorAreaSqm?.toString() ?? "",
    assigneeId: project?.assigneeId ?? "",
    contractDate: project?.contractDate ?? "",
    startDate: project?.startDate ?? "",
    endDate: project?.endDate ?? "",
    postalCode: project?.postalCode ?? "",
    address: project?.address ?? "",
    progress: project?.progress?.toString() ?? "0",
  };
}

export function ProjectDialog({ project }: { project?: Project }) {
  const { customers, addProject, updateProject } = useData();
  const isEdit = Boolean(project);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(buildForm(project));

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    setForm(buildForm(project));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      customerId: form.customerId,
      status: form.status,
      constructionType: form.constructionType,
      budget: Number(form.budget) || 0,
      floorAreaSqm: Number(form.floorAreaSqm) || 0,
      assigneeId: form.assigneeId,
      contractDate: form.contractDate,
      startDate: form.startDate,
      endDate: form.endDate,
      postalCode: form.postalCode,
      address: form.address,
    };
    if (isEdit && project) {
      updateProject(project.id, { ...payload, progress: Number(form.progress) || 0 });
    } else {
      addProject(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="outline" size="sm">
              <Pencil />
              編集
            </Button>
          ) : (
            <Button size="sm">
              <Plus />
              新規案件登録
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? "案件情報を編集" : "新規案件登録"}</DialogTitle>
          </DialogHeader>

          <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto pr-1">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="p-name">案件名</Label>
              <Input
                id="p-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>顧客</Label>
              <Select
                value={form.customerId}
                onValueChange={(v) => setForm({ ...form, customerId: v ?? "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>担当者</Label>
              <Select
                value={form.assigneeId}
                onValueChange={(v) => setForm({ ...form, assigneeId: v ?? "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}({s.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>工事種別</Label>
              <Select
                value={form.constructionType}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    constructionType: (v as ConstructionType) ?? "新築",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>ステータス</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: (v as ProjectStatus) ?? "商談中" })
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
              <Label htmlFor="p-budget">予算(円)</Label>
              <Input
                id="p-budget"
                type="number"
                required
                min={0}
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-floor">延床面積(m²)</Label>
              <Input
                id="p-floor"
                type="number"
                required
                min={0}
                step="0.1"
                value={form.floorAreaSqm}
                onChange={(e) => setForm({ ...form, floorAreaSqm: e.target.value })}
              />
            </div>

            {isEdit && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="p-progress">進捗(%)</Label>
                <Input
                  id="p-progress"
                  type="number"
                  min={0}
                  max={100}
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: e.target.value })}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-contract">契約日</Label>
              <Input
                id="p-contract"
                type="date"
                required
                value={form.contractDate}
                onChange={(e) => setForm({ ...form, contractDate: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-start">着工日</Label>
              <Input
                id="p-start"
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-end">竣工予定日</Label>
              <Input
                id="p-end"
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-postal">現場郵便番号</Label>
              <Input
                id="p-postal"
                required
                placeholder="123-4567"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="p-address">現場住所</Label>
              <Input
                id="p-address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">{isEdit ? "保存" : "登録"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
