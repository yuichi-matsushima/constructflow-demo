import Link from "next/link";
import { asc } from "drizzle-orm";
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  activities,
  formatCurrency,
  getStaff,
  statusColor,
} from "@/lib/mock-data";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { getDb } from "@/db/client";
import { toCustomer, toEstimate, toProject } from "@/db/mappers";
import { customers, estimates, projects } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const db = getDb();
  const [customerRows, projectRows, estimateRows] = await Promise.all([
    db.select().from(customers).orderBy(asc(customers.customerCode)),
    db.select().from(projects).orderBy(asc(projects.projectCode)),
    db.select().from(estimates).orderBy(asc(estimates.estimateCode)),
  ]);
  const allCustomers = customerRows.map(toCustomer);
  const allProjects = projectRows.map(toProject);
  const allEstimates = estimateRows.map(toEstimate);

  const inProgressCount = allProjects.filter(
    (p) => p.status === "施工中" || p.status === "設計中"
  ).length;
  const pendingEstimates = allEstimates.filter(
    (e) => e.status === "提出済み" || e.status === "作成中"
  ).length;
  const totalBudget = allProjects.reduce((sum, p) => sum + p.budget, 0);

  const recentProjects = [...allProjects]
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
        <p className="text-sm text-muted-foreground">
          全案件のサマリーです(サンプルデータ)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              進行中の案件
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}件</div>
            <p className="text-xs text-muted-foreground">全{allProjects.length}件中</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              登録顧客数
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allCustomers.length}件</div>
            <p className="text-xs text-muted-foreground">個人・法人合計</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              対応中の見積もり
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEstimates}件</div>
            <p className="text-xs text-muted-foreground">作成中・提出済み</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              受注総額
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">全案件合計</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>月別売上推移</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>直近のアクティビティ</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              {activities.map((a) => (
                <li key={a.id} className="text-sm">
                  <p className="text-foreground">{a.message}</p>
                  <p className="text-xs text-muted-foreground">{a.at}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>最近の案件</CardTitle>
          <Link
            href="/projects"
            className="text-sm text-primary hover:underline"
          >
            すべて見る
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col divide-y">
            {recentProjects.map((p) => {
              const customer = allCustomers.find((c) => c.id === p.customerId);
              const assignee = getStaff(p.assigneeId);
              return (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {p.name}
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {p.projectCode}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {customer?.name} ・ 担当: {assignee?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(p.budget)}
                    </span>
                    <Badge className={statusColor[p.status]} variant="outline">
                      {p.status}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
