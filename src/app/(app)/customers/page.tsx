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
import { customers, getProjectsByCustomer } from "@/lib/mock-data";

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">顧客管理</h1>
        <p className="text-sm text-muted-foreground">
          全{customers.length}件の顧客(サンプルデータ)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>顧客一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>顧客名</TableHead>
                <TableHead>区分</TableHead>
                <TableHead>連絡先</TableHead>
                <TableHead>案件数</TableHead>
                <TableHead>登録日</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link
                      href={`/customers/${c.id}`}
                      className="font-medium hover:underline"
                    >
                      {c.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{c.kana}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{c.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <p>{c.phone}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </TableCell>
                  <TableCell>{getProjectsByCustomer(c.id).length}件</TableCell>
                  <TableCell>{c.registeredAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
