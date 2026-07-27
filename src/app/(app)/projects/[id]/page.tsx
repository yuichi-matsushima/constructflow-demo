import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProjectDialog } from "@/components/projects/project-dialog";
import {
  formatCurrency,
  getLogsByProject,
  getStaff,
  paymentStatusColor,
  priorityColor,
  statusColor,
  estimateStatusColor,
} from "@/lib/mock-data";
import { getDb } from "@/db/client";
import { toCustomer, toEstimate, toProject } from "@/db/mappers";
import { customers, estimates, projects } from "@/db/schema";

export const dynamic = "force-dynamic";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const [projectRow] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id));

  if (!projectRow) {
    notFound();
  }

  const project = toProject(projectRow);
  const [customerRows, estimateRows] = await Promise.all([
    db.select().from(customers).orderBy(asc(customers.customerCode)),
    db
      .select()
      .from(estimates)
      .where(eq(estimates.projectId, project.id))
      .orderBy(asc(estimates.estimateCode)),
  ]);
  const allCustomers = customerRows.map(toCustomer);
  const customer = allCustomers.find((c) => c.id === project.customerId);
  const assignee = getStaff(project.assigneeId);
  const relatedEstimates = estimateRows.map(toEstimate);
  const logs = getLogsByProject(project.id);
  const estimateTotal = relatedEstimates
    .filter((e) => e.status === "承認")
    .reduce((sum, e) => sum + e.amount, 0);

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
          <Badge className={priorityColor[project.priority]} variant="outline">
            優先度: {project.priority}
          </Badge>
          <Badge variant="outline">{project.constructionType}</Badge>
          <div className="ml-auto">
            <ProjectDialog project={project} customers={allCustomers} />
          </div>
        </div>
        <p className="font-mono text-xs text-muted-foreground">{project.projectCode}</p>
        <p className="text-sm text-muted-foreground">
          {project.postalCode} {project.address}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
              承認済見積合計 {formatCurrency(estimateTotal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">工期</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {project.startDate} 〜 {project.endDate}
            </p>
            <p className="text-xs text-muted-foreground">
              延床面積 {project.floorAreaSqm.toFixed(1)}m²
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">担当者</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{assignee?.name}</p>
            <p className="text-xs text-muted-foreground">
              {assignee?.department} ・ {assignee?.role}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="phases">工程</TabsTrigger>
          <TabsTrigger value="estimates">見積</TabsTrigger>
          <TabsTrigger value="logs">対応履歴</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="案件コード" value={project.projectCode} />
              <InfoRow label="案件ID" value={project.id} />
              <InfoRow label="工事種別" value={project.constructionType} />
              <InfoRow label="構造" value={project.structureType} />
              <InfoRow
                label="優先度"
                value={
                  <Badge className={priorityColor[project.priority]} variant="outline">
                    {project.priority}
                  </Badge>
                }
              />
              <InfoRow
                label="入金状況"
                value={
                  <Badge
                    className={paymentStatusColor[project.paymentStatus]}
                    variant="outline"
                  >
                    {project.paymentStatus}
                  </Badge>
                }
              />
              <InfoRow label="契約日" value={project.contractDate} />
              <InfoRow label="着工日" value={project.startDate} />
              <InfoRow label="竣工予定日" value={project.endDate} />
              <InfoRow label="郵便番号" value={project.postalCode} />
              <InfoRow label="現場住所" value={project.address} />
              <InfoRow label="延床面積" value={`${project.floorAreaSqm.toFixed(1)}m²`} />
              <InfoRow label="予算" value={formatCurrency(project.budget)} />
              <InfoRow label="進捗率" value={`${project.progress}%`} />
              <InfoRow label="担当者" value={`${assignee?.name}(${assignee?.employeeId})`} />
              {project.remarks && (
                <InfoRow label="備考" value={project.remarks} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases">
          <Card>
            <CardHeader>
              <CardTitle>工程進捗</CardTitle>
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
        </TabsContent>

        <TabsContent value="estimates">
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
                          {e.createdAt} 作成 ・ 項目数 {e.itemCount} ・ 有効期限 {e.validUntil}
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
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>対応履歴</CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  対応履歴はまだありません
                </p>
              ) : (
                <div className="flex flex-col divide-y">
                  {logs.map((l) => (
                    <div key={l.id} className="py-3 text-sm">
                      <p>{l.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {l.at} ・ {l.author}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
