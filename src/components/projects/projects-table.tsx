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
import { Progress } from "@/components/ui/progress";
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
import { ProjectDialog } from "@/components/projects/project-dialog";
import {
  ConstructionType,
  Customer,
  formatCurrency,
  getStaff,
  priorityColor,
  Project,
  ProjectStatus,
  statusColor,
} from "@/lib/mock-data";

const statusOptions: ProjectStatus[] = [
  "商談中",
  "契約済み",
  "設計中",
  "施工中",
  "完了",
];

const typeOptions: ConstructionType[] = ["新築", "リフォーム", "増築", "店舗改装"];

type SortKey =
  | "code"
  | "name"
  | "customer"
  | "status"
  | "priority"
  | "progress"
  | "budget"
  | "floorArea"
  | "contractDate"
  | "assignee";

export function ProjectsTable({
  projects,
  customers,
}: {
  projects: Project[];
  customers: Customer[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey | null>("contractDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const customerNameOf = (customerId: string) =>
    customers.find((c) => c.id === customerId)?.name ?? "";

  const priorityRank: Record<Project["priority"], number> = { 高: 3, 中: 2, 低: 1 };

  const getSortValue = (p: Project, key: SortKey) => {
    switch (key) {
      case "code":
        return p.projectCode;
      case "name":
        return p.name;
      case "customer":
        return customerNameOf(p.customerId);
      case "status":
        return p.status;
      case "priority":
        return priorityRank[p.priority];
      case "progress":
        return p.progress;
      case "budget":
        return p.budget;
      case "floorArea":
        return p.floorAreaSqm;
      case "contractDate":
        return p.contractDate;
      case "assignee":
        return getStaff(p.assigneeId)?.name ?? "";
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
    let list = projects.filter((p) => {
      const matchesQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        customerNameOf(p.customerId).toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesType = typeFilter === "all" || p.constructionType === typeFilter;
      return matchesQuery && matchesStatus && matchesType;
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
  }, [query, statusFilter, typeFilter, sortKey, sortDir, projects, customers]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">案件管理</h1>
          <p className="text-sm text-muted-foreground">
            全{projects.length}件中 {filtered.length}件表示(サンプルデータ)
          </p>
        </div>
        <ProjectDialog customers={customers} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>案件一覧</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="案件名・顧客名・住所で検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v ?? "all")}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全ステータス</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v ?? "all")}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="工事種別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全工事種別</SelectItem>
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
                案件名
              </GridHeaderCell>
              <GridHeaderCell sortKey="customer" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                顧客
              </GridHeaderCell>
              <GridHeaderCell align="center">種別</GridHeaderCell>
              <GridHeaderCell sortKey="priority" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="center">
                優先度
              </GridHeaderCell>
              <GridHeaderCell sortKey="status" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="center">
                ステータス
              </GridHeaderCell>
              <GridHeaderCell sortKey="progress" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                進捗
              </GridHeaderCell>
              <GridHeaderCell sortKey="budget" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="right">
                予算
              </GridHeaderCell>
              <GridHeaderCell sortKey="floorArea" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="right">
                延床面積
              </GridHeaderCell>
              <GridHeaderCell sortKey="contractDate" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                契約日
              </GridHeaderCell>
              <GridHeaderCell sortKey="assignee" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                担当
              </GridHeaderCell>
            </GridHead>
            <GridBody>
              {filtered.map((p) => {
                const assignee = getStaff(p.assigneeId);
                return (
                  <GridRow key={p.id} onClick={() => router.push(`/projects/${p.id}`)}>
                    <GridCell className="font-mono text-xs text-muted-foreground">
                      {p.projectCode}
                    </GridCell>
                    <GridCell className="font-medium text-foreground">
                      {p.name}
                      <p className="text-xs font-normal text-muted-foreground">
                        {p.postalCode} {p.address}
                      </p>
                    </GridCell>
                    <GridCell>{customerNameOf(p.customerId)}</GridCell>
                    <GridCell align="center">
                      <Badge variant="outline">{p.constructionType}</Badge>
                    </GridCell>
                    <GridCell align="center">
                      <Badge className={priorityColor[p.priority]} variant="outline">
                        {p.priority}
                      </Badge>
                    </GridCell>
                    <GridCell align="center">
                      <Badge className={statusColor[p.status]} variant="outline">
                        {p.status}
                      </Badge>
                    </GridCell>
                    <GridCell className="w-32">
                      <div className="flex items-center gap-2">
                        <Progress value={p.progress} className="h-1.5" />
                        <span className="text-xs text-muted-foreground">
                          {p.progress}%
                        </span>
                      </div>
                    </GridCell>
                    <GridCell align="right">{formatCurrency(p.budget)}</GridCell>
                    <GridCell align="right">{p.floorAreaSqm.toFixed(1)}m²</GridCell>
                    <GridCell>{p.contractDate}</GridCell>
                    <GridCell>{assignee?.name}</GridCell>
                  </GridRow>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-2.5 py-8 text-center text-sm text-muted-foreground">
                    該当する案件がありません
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
