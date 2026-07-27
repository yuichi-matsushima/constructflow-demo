"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CustomerDialog } from "@/components/customers/customer-dialog";
import { estimateStatusColor, formatCurrency, statusColor } from "@/lib/mock-data";
import { useData } from "@/lib/data-context";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { customers, projects, estimates } = useData();
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="flex flex-col gap-4">
        <Link
          href="/customers"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          顧客一覧に戻る
        </Link>
        <p className="text-sm text-muted-foreground">
          指定された顧客が見つかりません。
        </p>
      </div>
    );
  }

  const relatedProjects = projects.filter((p) => p.customerId === customer.id);
  const relatedEstimates = estimates.filter((e) => e.customerId === customer.id);
  const totalBudget = relatedProjects.reduce((sum, p) => sum + p.budget, 0);

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
          <div className="ml-auto">
            <CustomerDialog customer={customer} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{customer.kana}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">連絡先</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{customer.phone}</p>
            <p className="text-xs text-muted-foreground">{customer.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">住所</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{customer.postalCode}</p>
            <p className="text-xs text-muted-foreground">{customer.address}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">取引累計</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{formatCurrency(totalBudget)}</p>
            <p className="text-xs text-muted-foreground">
              案件{relatedProjects.length}件
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">基本情報</TabsTrigger>
          <TabsTrigger value="projects">案件</TabsTrigger>
          <TabsTrigger value="estimates">見積</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="顧客ID" value={customer.id} />
              <InfoRow label="区分" value={customer.type} />
              <InfoRow label="フリガナ" value={customer.kana} />
              {customer.contactPerson && (
                <InfoRow label="担当者" value={customer.contactPerson} />
              )}
              <InfoRow label="電話番号" value={customer.phone} />
              <InfoRow label="メール" value={customer.email} />
              <InfoRow label="郵便番号" value={customer.postalCode} />
              <InfoRow label="住所" value={customer.address} />
              <InfoRow label="登録日" value={customer.registeredAt} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
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
                        <p className="text-xs text-muted-foreground">{e.createdAt}</p>
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
      </Tabs>
    </div>
  );
}
