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
import { EstimateDialog } from "@/components/estimates/estimate-dialog";
import {
  Customer,
  Estimate,
  EstimateStatus,
  estimateStatusColor,
  formatCurrency,
  Project,
} from "@/lib/mock-data";

const statusOptions: EstimateStatus[] = ["作成中", "提出済み", "承認", "却下"];

type SortKey = "code" | "title" | "project" | "customer" | "amount" | "itemCount" | "status" | "createdAt";

export function EstimatesTable({
  estimates,
  projects,
  customers,
}: {
  estimates: Estimate[];
  projects: Project[];
  customers: Customer[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey | null>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const projectOf = (projectId: string) =>
    projects.find((p) => p.id === projectId);
  const customerOf = (customerId: string) =>
    customers.find((c) => c.id === customerId);

  const getSortValue = (e: Estimate, key: SortKey) => {
    switch (key) {
      case "code":
        return e.estimateCode;
      case "title":
        return e.title;
      case "project":
        return projectOf(e.projectId)?.name ?? "";
      case "customer":
        return customerOf(e.customerId)?.name ?? "";
      case "amount":
        return e.amount;
      case "itemCount":
        return e.itemCount;
      case "status":
        return e.status;
      case "createdAt":
        return e.createdAt;
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
    let list = estimates.filter((e) => {
      const project = projectOf(e.projectId);
      const customer = customerOf(e.customerId);
      const matchesQuery =
        q === "" ||
        e.title.toLowerCase().includes(q) ||
        e.estimateCode.toLowerCase().includes(q) ||
        project?.name.toLowerCase().includes(q) ||
        customer?.name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesQuery && matchesStatus;
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
  }, [query, statusFilter, sortKey, sortDir, estimates, projects, customers]);

  const totalAmount = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">見積もり</h1>
          <p className="text-sm text-muted-foreground">
            全{estimates.length}件中 {filtered.length}件表示 ・ 合計 {formatCurrency(totalAmount)}
          </p>
        </div>
        <EstimateDialog projects={projects} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>見積もり一覧</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="件名・案件・顧客で検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v ?? "all")}
            >
              <SelectTrigger className="w-36">
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
          </div>

          <GridTable>
            <GridHead>
              <GridHeaderCell sortKey="code" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                コード
              </GridHeaderCell>
              <GridHeaderCell sortKey="title" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                件名
              </GridHeaderCell>
              <GridHeaderCell sortKey="project" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                案件
              </GridHeaderCell>
              <GridHeaderCell sortKey="customer" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                顧客
              </GridHeaderCell>
              <GridHeaderCell sortKey="amount" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="right">
                金額
              </GridHeaderCell>
              <GridHeaderCell sortKey="itemCount" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="right">
                項目数
              </GridHeaderCell>
              <GridHeaderCell sortKey="status" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="center">
                ステータス
              </GridHeaderCell>
              <GridHeaderCell sortKey="createdAt" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                作成日
              </GridHeaderCell>
              <GridHeaderCell>有効期限</GridHeaderCell>
              <GridHeaderCell align="center">操作</GridHeaderCell>
            </GridHead>
            <GridBody>
              {filtered.map((e) => {
                const project = projectOf(e.projectId);
                const customer = customerOf(e.customerId);
                return (
                  <GridRow key={e.id} onClick={() => project && router.push(`/projects/${project.id}`)}>
                    <GridCell className="font-mono text-xs text-muted-foreground">
                      {e.estimateCode}
                    </GridCell>
                    <GridCell className="font-medium text-foreground">{e.title}</GridCell>
                    <GridCell>{project?.name}</GridCell>
                    <GridCell>{customer?.name}</GridCell>
                    <GridCell align="right">{formatCurrency(e.amount)}</GridCell>
                    <GridCell align="right">{e.itemCount}</GridCell>
                    <GridCell align="center">
                      <Badge className={estimateStatusColor[e.status]} variant="outline">
                        {e.status}
                      </Badge>
                    </GridCell>
                    <GridCell>{e.createdAt}</GridCell>
                    <GridCell>{e.validUntil}</GridCell>
                    <GridCell align="center" className="border-r-0">
                      <div onClick={(evt) => evt.stopPropagation()}>
                        <EstimateDialog estimate={e} projects={projects} />
                      </div>
                    </GridCell>
                  </GridRow>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-2.5 py-8 text-center text-sm text-muted-foreground">
                    該当する見積もりがありません
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
