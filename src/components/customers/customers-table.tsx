"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GridBody,
  GridCell,
  GridHead,
  GridHeaderCell,
  GridRow,
  GridTable,
} from "@/components/data-grid/grid-table";
import { CustomerDialog } from "@/components/customers/customer-dialog";
import { Customer, CustomerType, Project } from "@/lib/mock-data";

const typeOptions: CustomerType[] = ["個人", "法人"];

type SortKey = "code" | "name" | "type" | "channel" | "registeredAt" | "projectCount";

export function CustomersTable({
  customers,
  projects,
}: {
  customers: Customer[];
  projects: Project[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey | null>("registeredAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const projectCountOf = (customerId: string) =>
    projects.filter((p) => p.customerId === customerId).length;

  const getSortValue = (c: Customer, key: SortKey) => {
    switch (key) {
      case "code":
        return c.customerCode;
      case "name":
        return c.name;
      case "type":
        return c.type;
      case "channel":
        return c.channel;
      case "registeredAt":
        return c.registeredAt;
      case "projectCount":
        return projectCountOf(c.id);
    }
  };

  const handleSort = (key: string) => {
    const k = key as SortKey;
    if (sortKey === k) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = customers.filter((c) => {
      const matchesQuery =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.customerCode.toLowerCase().includes(q) ||
        c.kana.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || c.type === typeFilter;
      return matchesQuery && matchesType;
    });

    if (sortKey) {
      list = [...list].sort((a, b) => {
        const av = getSortValue(a, sortKey);
        const bv = getSortValue(b, sortKey);
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv), "ja");
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, typeFilter, sortKey, sortDir, customers, projects]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">顧客管理</h1>
          <p className="text-sm text-muted-foreground">
            全{customers.length}件中 {filtered.length}件表示(サンプルデータ)
          </p>
        </div>
        <CustomerDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>顧客一覧</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="顧客名・住所・メールで検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v ?? "all")}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="区分" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全区分</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <GridTable>
            <GridHead>
              <GridHeaderCell sortKey="code" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                コード
              </GridHeaderCell>
              <GridHeaderCell sortKey="name" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                顧客名
              </GridHeaderCell>
              <GridHeaderCell sortKey="type" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="center">
                区分
              </GridHeaderCell>
              <GridHeaderCell sortKey="channel" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="center">
                流入経路
              </GridHeaderCell>
              <GridHeaderCell>郵便番号</GridHeaderCell>
              <GridHeaderCell>住所</GridHeaderCell>
              <GridHeaderCell>連絡先</GridHeaderCell>
              <GridHeaderCell sortKey="projectCount" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="right">
                案件数
              </GridHeaderCell>
              <GridHeaderCell sortKey="registeredAt" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                登録日
              </GridHeaderCell>
            </GridHead>
            <GridBody>
              {filtered.map((c) => (
                <GridRow key={c.id} onClick={() => router.push(`/customers/${c.id}`)}>
                  <GridCell className="font-mono text-xs text-muted-foreground">
                    {c.customerCode}
                  </GridCell>
                  <GridCell className="font-medium text-foreground">
                    {c.name}
                    <p className="text-xs font-normal text-muted-foreground">
                      {c.kana}
                      {c.contactPerson ? ` ・ 担当: ${c.contactPerson}` : ""}
                    </p>
                  </GridCell>
                  <GridCell align="center">
                    <Badge variant="outline">{c.type}</Badge>
                  </GridCell>
                  <GridCell align="center">
                    <Badge variant="outline">{c.channel}</Badge>
                  </GridCell>
                  <GridCell>{c.postalCode}</GridCell>
                  <GridCell>{c.address}</GridCell>
                  <GridCell>
                    {c.phone}
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </GridCell>
                  <GridCell align="right">{projectCountOf(c.id)}件</GridCell>
                  <GridCell>{c.registeredAt}</GridCell>
                </GridRow>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-2.5 py-8 text-center text-sm text-muted-foreground">
                    該当する顧客がありません
                  </td>
                </tr>
              )}
            </GridBody>
          </GridTable>
        </CardContent>
      </Card>
    </div>
  );
}
