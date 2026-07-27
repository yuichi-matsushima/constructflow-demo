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
import {
  estimateStatusColor,
  estimates,
  formatCurrency,
  getCustomer,
  getProject,
} from "@/lib/mock-data";

export default function EstimatesPage() {
  const sorted = [...estimates].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">見積もり</h1>
        <p className="text-sm text-muted-foreground">
          全{estimates.length}件の見積もり(サンプルデータ)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>見積もり一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>件名</TableHead>
                <TableHead>案件</TableHead>
                <TableHead>顧客</TableHead>
                <TableHead>金額</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>作成日</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((e) => {
                const project = getProject(e.projectId);
                const customer = getCustomer(e.customerId);
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.title}</TableCell>
                    <TableCell>
                      {project && (
                        <Link
                          href={`/projects/${project.id}`}
                          className="hover:underline"
                        >
                          {project.name}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{customer?.name}</TableCell>
                    <TableCell>{formatCurrency(e.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        className={estimateStatusColor[e.status]}
                        variant="outline"
                      >
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{e.createdAt}</TableCell>
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
