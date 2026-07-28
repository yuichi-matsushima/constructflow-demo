"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
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
  Customer,
  Project,
  ProjectPhase,
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

const phaseColor: Record<string, string> = {
  商談: "bg-slate-400",
  契約: "bg-blue-500",
  設計: "bg-violet-500",
  着工: "bg-amber-500",
  上棟: "bg-orange-500",
  躯体工事: "bg-rose-500",
  内装仕上げ: "bg-cyan-500",
  引き渡し: "bg-emerald-500",
};
const fallbackPhaseColor = "bg-zinc-400";

function toDays(dateStr: string) {
  return new Date(dateStr).getTime() / (1000 * 60 * 60 * 24);
}

function toMonthStart(dateStr: string) {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

const LABEL_WIDTH = "260px";

export function ScheduleGantt({
  projects,
  customers,
}: {
  projects: Project[];
  customers: Customer[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const customerNameOf = (customerId: string) =>
    customers.find((c) => c.id === customerId)?.name ?? "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...projects]
      .filter((p) => {
        const matchesQuery =
          q === "" ||
          p.name.toLowerCase().includes(q) ||
          p.projectCode.toLowerCase().includes(q) ||
          customerNameOf(p.customerId).toLowerCase().includes(q);
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, statusFilter, projects, customers]);

  const allPhases: ProjectPhase[] = filtered.flatMap((p) => p.phases);
  const hasData = allPhases.length > 0;
  const minDay = hasData
    ? Math.min(...allPhases.map((ph) => toDays(ph.start)))
    : toDays(new Date().toISOString().slice(0, 10));
  const maxDay = hasData
    ? Math.max(...allPhases.map((ph) => toDays(ph.end)))
    : minDay + 30;
  const totalSpan = Math.max(maxDay - minDay, 1);

  const pctOf = (day: number) => ((day - minDay) / totalSpan) * 100;

  const months = useMemo(() => {
    if (!hasData) return [];
    const start = toMonthStart(new Date(minDay * 86400000).toISOString());
    const end = toMonthStart(new Date(maxDay * 86400000).toISOString());
    const result: Date[] = [];
    let cursor = start;
    let guard = 0;
    while (cursor.getTime() <= end.getTime() && guard < 60) {
      result.push(cursor);
      cursor = addMonths(cursor, 1);
      guard++;
    }
    return result;
  }, [minDay, maxDay, hasData]);

  const todayDay = toDays(new Date().toISOString().slice(0, 10));
  const showToday = todayDay >= minDay && todayDay <= maxDay;

  const usedPhaseNames = Array.from(
    new Set(filtered.flatMap((p) => p.phases.map((ph) => ph.name)))
  );

  const rowCount = filtered.length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-heading">スケジュール</h1>
        <p className="text-sm text-muted-foreground">
          全案件の工程スケジュール(サンプルデータ)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>案件別 工程ガントチャート</CardTitle>
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
            <span className="text-xs text-muted-foreground">
              {filtered.length}件表示
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-md border bg-muted/30 px-3 py-2">
            {usedPhaseNames.map((name) => (
              <div key={name} className="flex items-center gap-1.5 text-xs">
                <span
                  className={`h-2.5 w-2.5 rounded-sm ${phaseColor[name] ?? fallbackPhaseColor}`}
                />
                {name}
              </div>
            ))}
            {showToday && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-0.5 bg-red-500" />
                本日
              </div>
            )}
            <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-slate-400 opacity-100" />
                完了済み工程
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-slate-400 opacity-50" />
                未完了工程
              </span>
            </div>
          </div>

          {!hasData ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              該当する案件がありません
            </p>
          ) : (
            <div className="overflow-x-auto">
              <div
                className="grid min-w-[900px] gap-y-1"
                style={{ gridTemplateColumns: `${LABEL_WIDTH} 1fr` }}
              >
                <div className="sticky left-0 z-20 flex items-end bg-background pb-1.5 text-xs font-medium text-muted-foreground">
                  案件
                </div>
                <div className="relative h-6">
                  {months.map((m, i) => {
                    const day = toDays(m.toISOString());
                    return (
                      <div
                        key={i}
                        className="absolute top-0 h-full border-l border-border/70 pl-1 text-[11px] text-muted-foreground"
                        style={{ left: `${pctOf(day)}%` }}
                      >
                        {i === 0 || m.getMonth() === 0
                          ? `${m.getFullYear()}年${m.getMonth() + 1}月`
                          : `${m.getMonth() + 1}月`}
                      </div>
                    );
                  })}
                </div>

                <div
                  className="relative col-start-2"
                  style={{ gridRow: `2 / ${rowCount + 2}` }}
                >
                  {months.map((m, i) => {
                    const day = toDays(m.toISOString());
                    return (
                      <div
                        key={i}
                        className="pointer-events-none absolute top-0 h-full border-l border-border/50"
                        style={{ left: `${pctOf(day)}%` }}
                      />
                    );
                  })}
                  {showToday && (
                    <div
                      className="pointer-events-none absolute top-0 h-full w-0.5 bg-red-500/70"
                      style={{ left: `${pctOf(todayDay)}%` }}
                    />
                  )}
                </div>

                {filtered.map((p) => {
                  const customer = customers.find((c) => c.id === p.customerId);
                  return (
                    <Fragment key={p.id}>
                      <Link
                        href={`/projects/${p.id}`}
                        className="sticky left-0 z-10 flex flex-col justify-center gap-0.5 border-r bg-background py-1.5 pr-3 hover:bg-accent/40"
                      >
                        <span className="truncate text-sm font-medium">
                          {p.name}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="font-mono">{p.projectCode}</span>
                          <span className="truncate">{customer?.name}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            className={statusColor[p.status]}
                            variant="outline"
                          >
                            {p.status}
                          </Badge>
                          <Progress value={p.progress} className="h-1 w-12" />
                        </div>
                      </Link>
                      <div className="relative flex items-center py-1.5">
                        <div className="relative h-6 w-full rounded-md bg-muted">
                          {p.phases.map((phase) => {
                            const start = toDays(phase.start);
                            const end = toDays(phase.end);
                            const left = pctOf(start);
                            const width = Math.max(
                              ((end - start) / totalSpan) * 100,
                              0.6
                            );
                            return (
                              <div
                                key={phase.name}
                                title={`${phase.name}: ${phase.start} 〜 ${phase.end}${phase.done ? "(完了)" : ""}`}
                                className={`absolute top-0.5 h-5 rounded ${
                                  phaseColor[phase.name] ?? fallbackPhaseColor
                                } ${phase.done ? "opacity-100" : "opacity-50"}`}
                                style={{ left: `${left}%`, width: `${width}%` }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
