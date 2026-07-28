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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { Customer, Project, ProjectStatus, statusColor } from "@/lib/mock-data";

const statusOptions: ProjectStatus[] = [
  "商談中",
  "契約済み",
  "設計中",
  "施工中",
  "完了",
];

const statusBarColor: Record<ProjectStatus, string> = {
  商談中: "bg-slate-400",
  契約済み: "bg-blue-500",
  設計中: "bg-amber-500",
  施工中: "bg-orange-500",
  完了: "bg-emerald-500",
};

function toDays(dateStr: string) {
  return new Date(dateStr).getTime() / (1000 * 60 * 60 * 24);
}

type SortKey = "code" | "name" | "status" | "startDate" | "endDate" | "progress";

export function ScheduleTable({
  projects,
  customers,
}: {
  projects: Project[];
  customers: Customer[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>("startDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const customerNameOf = (customerId: string) =>
    customers.find((c) => c.id === customerId)?.name ?? "";

  const getSortValue = (p: Project, key: SortKey) => {
    switch (key) {
      case "code":
        return p.projectCode;
      case "name":
        return p.name;
      case "status":
        return p.status;
      case "startDate":
        return p.startDate;
      case "endDate":
        return p.endDate;
      case "progress":
        return p.progress;
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
        customerNameOf(p.customerId).toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesCompleted = showCompleted || p.status !== "完了";
      return matchesQuery && matchesStatus && matchesCompleted;
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
  }, [query, statusFilter, showCompleted, sortKey, sortDir, projects, customers]);

  const hasData = filtered.length > 0;
  const minDay = hasData ? Math.min(...filtered.map((p) => toDays(p.startDate))) : 0;
  const maxDay = hasData ? Math.max(...filtered.map((p) => toDays(p.endDate))) : 1;
  const totalSpan = Math.max(maxDay - minDay, 1);

  const todayDay = toDays(new Date().toISOString().slice(0, 10));
  const showToday = hasData && todayDay >= minDay && todayDay <= maxDay;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">スケジュール</h1>
        <p className="text-sm text-muted-foreground">
          全案件の工期を一覧できます(サンプルデータ)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>案件スケジュール</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="案件名・顧客名・コードで検索"
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
            <div className="flex items-center gap-1.5">
              <Checkbox
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={(v) => setShowCompleted(v === true)}
              />
              <Label
                htmlFor="show-completed"
                className="text-sm font-normal text-muted-foreground"
              >
                完了案件も表示
              </Label>
            </div>
            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length}件表示
            </span>
          </div>

          {!hasData ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              該当する案件がありません
            </p>
          ) : (
            <GridTable>
              <GridHead>
                <GridHeaderCell sortKey="code" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                  コード
                </GridHeaderCell>
                <GridHeaderCell sortKey="name" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                  案件名
                </GridHeaderCell>
                <GridHeaderCell sortKey="status" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort} align="center">
                  ステータス
                </GridHeaderCell>
                <GridHeaderCell sortKey="startDate" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                  着工日
                </GridHeaderCell>
                <GridHeaderCell sortKey="endDate" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                  竣工予定日
                </GridHeaderCell>
                <GridHeaderCell sortKey="progress" activeSortKey={sortKey} sortDirection={sortDir} onSort={handleSort}>
                  進捗
                </GridHeaderCell>
                <GridHeaderCell>工期(相対位置)</GridHeaderCell>
              </GridHead>
              <GridBody>
                {filtered.map((p) => {
                  const start = toDays(p.startDate);
                  const end = toDays(p.endDate);
                  const left = ((start - minDay) / totalSpan) * 100;
                  const width = Math.max(((end - start) / totalSpan) * 100, 3);
                  return (
                    <GridRow key={p.id} onClick={() => router.push(`/projects/${p.id}`)}>
                      <GridCell className="font-mono text-xs text-muted-foreground">
                        {p.projectCode}
                      </GridCell>
                      <GridCell className="font-medium text-foreground">
                        {p.name}
                        <p className="text-xs font-normal text-muted-foreground">
                          {customerNameOf(p.customerId)}
                        </p>
                      </GridCell>
                      <GridCell align="center">
                        <Badge className={statusColor[p.status]} variant="outline">
                          {p.status}
                        </Badge>
                      </GridCell>
                      <GridCell>{p.startDate}</GridCell>
                      <GridCell>{p.endDate}</GridCell>
                      <GridCell className="w-32">
                        <div className="flex items-center gap-2">
                          <Progress value={p.progress} className="h-1.5" />
                          <span className="text-xs text-muted-foreground">
                            {p.progress}%
                          </span>
                        </div>
                      </GridCell>
                      <GridCell className="w-40 border-r-0">
                        <div className="relative h-2.5 w-full rounded-full bg-muted">
                          <div
                            className={`absolute top-0 h-full rounded-full ${statusBarColor[p.status]}`}
                            style={{ left: `${left}%`, width: `${width}%` }}
                          />
                          {showToday && (
                            <div
                              className="absolute -top-0.5 h-3.5 w-px bg-red-500"
                              style={{ left: `${((todayDay - minDay) / totalSpan) * 100}%` }}
                            />
                          )}
                        </div>
                      </GridCell>
                    </GridRow>
                  );
                })}
              </GridBody>
            </GridTable>
          )}

          {hasData && (
            <p className="text-xs text-muted-foreground">
              「工期(相対位置)」は表示中の案件全体({new Date(minDay * 86400000).toLocaleDateString("ja-JP")} 〜 {new Date(maxDay * 86400000).toLocaleDateString("ja-JP")})の中でのこの案件の位置を示します
              {showToday && "(赤い縦線が本日)"}。
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
