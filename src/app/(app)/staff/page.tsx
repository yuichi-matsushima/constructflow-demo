import { asc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GridBody,
  GridCell,
  GridHead,
  GridHeaderCell,
  GridRow,
  GridTable,
} from "@/components/data-grid/grid-table";
import { formatCurrency, staff } from "@/lib/mock-data";
import { getDb } from "@/db/client";
import { toProject } from "@/db/mappers";
import { projects } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const projectRows = await getDb()
    .select()
    .from(projects)
    .orderBy(asc(projects.projectCode));
  const allProjects = projectRows.map(toProject);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">スタッフ管理</h1>
        <p className="text-sm text-muted-foreground">
          全{staff.length}名(サンプルデータ)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>スタッフ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <GridTable>
            <GridHead>
              <GridHeaderCell>社員番号</GridHeaderCell>
              <GridHeaderCell>氏名</GridHeaderCell>
              <GridHeaderCell align="center">部署</GridHeaderCell>
              <GridHeaderCell align="center">役割</GridHeaderCell>
              <GridHeaderCell align="right">担当案件数</GridHeaderCell>
              <GridHeaderCell align="right">担当案件合計金額</GridHeaderCell>
            </GridHead>
            <GridBody>
              {staff.map((s) => {
                const assignedProjects = allProjects.filter(
                  (p) => p.assigneeId === s.id
                );
                const total = assignedProjects.reduce(
                  (sum, p) => sum + p.budget,
                  0
                );
                return (
                  <GridRow key={s.id}>
                    <GridCell>{s.employeeId}</GridCell>
                    <GridCell className="font-medium text-foreground">
                      {s.name}
                    </GridCell>
                    <GridCell align="center">
                      <Badge variant="outline">{s.department}</Badge>
                    </GridCell>
                    <GridCell align="center">{s.role}</GridCell>
                    <GridCell align="right">{assignedProjects.length}件</GridCell>
                    <GridCell align="right">{formatCurrency(total)}</GridCell>
                  </GridRow>
                );
              })}
            </GridBody>
          </GridTable>
        </CardContent>
      </Card>
    </div>
  );
}
