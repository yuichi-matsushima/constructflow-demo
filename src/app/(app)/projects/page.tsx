import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  formatCurrency,
  getCustomer,
  getStaff,
  projects,
  statusColor,
} from "@/lib/mock-data";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">案件管理</h1>
        <p className="text-sm text-muted-foreground">
          全{projects.length}件の案件(サンプルデータ)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>案件一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>案件名</TableHead>
                <TableHead>顧客</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>進捗</TableHead>
                <TableHead>予算</TableHead>
                <TableHead>担当</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => {
                const customer = getCustomer(p.customerId);
                const assignee = getStaff(p.assigneeId);
                return (
                  <TableRow key={p.id} className="cursor-pointer">
                    <TableCell>
                      <Link
                        href={`/projects/${p.id}`}
                        className="font-medium hover:underline"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {p.address}
                      </p>
                    </TableCell>
                    <TableCell>{customer?.name}</TableCell>
                    <TableCell>
                      <Badge className={statusColor[p.status]} variant="outline">
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-40">
                      <div className="flex items-center gap-2">
                        <Progress value={p.progress} className="h-2" />
                        <span className="text-xs text-muted-foreground">
                          {p.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(p.budget)}</TableCell>
                    <TableCell>{assignee?.name}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
