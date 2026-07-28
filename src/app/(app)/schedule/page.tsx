import Link from "next/link";
import { asc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "@/lib/mock-data";
import { getDb } from "@/db/client";
import { toCustomer, toProject } from "@/db/mappers";
import { customers, projects } from "@/db/schema";

export const dynamic = "force-dynamic";

function toDays(dateStr: string) {
  return new Date(dateStr).getTime() / (1000 * 60 * 60 * 24);
}

export default async function SchedulePage() {
  const db = getDb();
  const [projectRows, customerRows] = await Promise.all([
    db.select().from(projects).orderBy(asc(projects.projectCode)),
    db.select().from(customers).orderBy(asc(customers.customerCode)),
  ]);
  const allProjects = projectRows.map(toProject);
  const allCustomers = customerRows.map(toCustomer);

  const allStarts = allProjects.flatMap((p) => p.phases.map((ph) => toDays(ph.start)));
  const allEnds = allProjects.flatMap((p) => p.phases.map((ph) => toDays(ph.end)));
  const minDay = Math.min(...allStarts);
  const maxDay = Math.max(...allEnds);
  const totalSpan = maxDay - minDay;

  const phaseColors = [
    "bg-slate-400",
    "bg-blue-500",
    "bg-amber-500",
    "bg-orange-500",
    "bg-violet-500",
    "bg-emerald-500",
  ];

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
        <CardContent>
          <div className="flex flex-col gap-6">
            {allProjects.map((p) => {
              const customer = allCustomers.find((c) => c.id === p.customerId);
              return (
                <div key={p.id} className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/projects/${p.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {customer?.name}
                      </span>
                      <Badge className={statusColor[p.status]} variant="outline">
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative h-8 w-full rounded-md bg-muted">
                    {p.phases.map((phase, idx) => {
                      const start = toDays(phase.start);
                      const end = toDays(phase.end);
                      const left = ((start - minDay) / totalSpan) * 100;
                      const width = Math.max(
                        ((end - start) / totalSpan) * 100,
                        0.6
                      );
                      return (
                        <div
                          key={phase.name}
                          title={`${phase.name}: ${phase.start} 〜 ${phase.end}`}
                          className={`absolute top-1 h-6 rounded ${
                            phaseColors[idx % phaseColors.length]
                          } ${phase.done ? "opacity-100" : "opacity-50"}`}
                          style={{ left: `${left}%`, width: `${width}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
