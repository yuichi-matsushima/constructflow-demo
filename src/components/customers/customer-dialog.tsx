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
import { Customer, CustomerChannel, CustomerType } from "@/lib/mock-data";
import { useData } from "@/lib/data-context";

const typeOptions: CustomerType[] = ["個人", "法人"];
const channelOptions: CustomerChannel[] = [
  "紹介",
  "Web広告",
  "チラシ",
  "展示場",
  "その他",
];

function buildForm(customer?: Customer) {
  return {
    name: customer?.name ?? "",
    kana: customer?.kana ?? "",
    type: customer?.type ?? ("個人" as CustomerType),
    channel: customer?.channel ?? ("紹介" as CustomerChannel),
    postalCode: customer?.postalCode ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    address: customer?.address ?? "",
    contactPerson: customer?.contactPerson ?? "",
  };
}

export function CustomerDialog({ customer }: { customer?: Customer }) {
  const { addCustomer, updateCustomer } = useData();
  const isEdit = Boolean(customer);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(buildForm(customer));

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    setForm(buildForm(customer));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      contactPerson: form.contactPerson || undefined,
    };
    if (isEdit && customer) {
      updateCustomer(customer.id, payload);
    } else {
      addCustomer(payload);
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
              新規顧客登録
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? "顧客情報を編集" : "新規顧客登録"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="c-name">顧客名 / 会社名</Label>
              <Input
                id="c-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="c-kana">フリガナ</Label>
              <Input
                id="c-kana"
                required
                value={form.kana}
                onChange={(e) => setForm({ ...form, kana: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>区分</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: (v as CustomerType) ?? "個人" })
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
              <Label>流入経路</Label>
              <Select
                value={form.channel}
                onValueChange={(v) =>
                  setForm({ ...form, channel: (v as CustomerChannel) ?? "紹介" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {channelOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-postal">郵便番号</Label>
              <Input
                id="c-postal"
                required
                placeholder="123-4567"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="c-address">住所</Label>
              <Input
                id="c-address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-phone">電話番号</Label>
              <Input
                id="c-phone"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-email">メールアドレス</Label>
              <Input
                id="c-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {form.type === "法人" && (
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="c-contact">担当者名</Label>
                <Input
                  id="c-contact"
                  value={form.contactPerson}
                  onChange={(e) =>
                    setForm({ ...form, contactPerson: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">{isEdit ? "保存" : "登録"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
