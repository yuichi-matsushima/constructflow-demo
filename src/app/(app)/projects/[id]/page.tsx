import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  formatCurrency,
  getCustomer,
  getEstimatesByProject,
  getProject,
  getStaff,
  projects,
  statusColor,
  estimateStatusColor,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const customer = getCustomer(project.customerId);
  const assignee = getStaff(project.assigneeId);
  const relatedEstimates = getEstimatesByProject(project.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/projects"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          案件一覧に戻る
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <Badge className={statusColor[project.status]} variant="outline">
            {project.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{project.address}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">顧客</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/customers/${project.customerId}`}
              className="font-medium hover:underline"
            >
              {customer?.name}
            </Link>
            <p className="text-xs text-muted-foreground">{customer?.phone}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">予算</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {formatCurrency(project.budget)}
            </p>
            <p className="text-xs text-muted-foreground">
              {project.startDate} 〜 {project.endDate}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">担当者</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{assignee?.name}</p>
            <p className="text-xs text-muted-foreground">{assignee?.role}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>進捗</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3">
            <Progress value={project.progress} className="h-2" />
            <span className="text-sm text-muted-foreground">
              {project.progress}%
            </span>
          </div>
          <ol className="flex flex-col gap-3">
            {project.phases.map((phase) => (
              <li key={phase.name} className="flex items-center gap-3 text-sm">
                {phase.done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className={phase.done ? "" : "text-muted-foreground"}>
                  {phase.name}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {phase.start} 〜 {phase.end}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>関連する見積もり</CardTitle>
        </CardHeader>
        <CardContent>
          {relatedEstimates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              見積もりはまだありません
            </p>
          ) : (
            <div className="flex flex-col divide-y">
              {relatedEstimates.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{formatCurrency(e.amount)}</span>
                    <Badge
                      className={estimateStatusColor[e.status]}
                      variant="outline"
                    >
                      {e.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
