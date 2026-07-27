import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  customers,
  formatCurrency,
  getCustomer,
  getProjectsByCustomer,
  statusColor,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return customers.map((c) => ({ id: c.id }));
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = getCustomer(id);
  if (!customer) notFound();

  const relatedProjects = getProjectsByCustomer(customer.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/customers"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          顧客一覧に戻る
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
          <Badge variant="outline">{customer.type}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{customer.kana}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">電話番号</CardTitle>
          </CardHeader>
          <CardContent>{customer.phone}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">メール</CardTitle>
          </CardHeader>
          <CardContent>{customer.email}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">住所</CardTitle>
          </CardHeader>
          <CardContent>{customer.address}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>関連する案件</CardTitle>
        </CardHeader>
        <CardContent>
          {relatedProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              関連する案件はありません
            </p>
          ) : (
            <div className="flex flex-col divide-y">
              {relatedProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.address}</p>
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
