import Link from "next/link";
import { HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex items-center gap-2">
            <HardHat className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">ConstructFlow</span>
          </div>
          <CardTitle>ログイン</CardTitle>
          <p className="text-sm text-muted-foreground">
            工務店向け業務管理デモ環境
          </p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="demo@constructflow.example.com"
                defaultValue="demo@constructflow.example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" type="password" defaultValue="demo-password" />
            </div>
            <Button
              className="mt-2"
              render={<Link href="/">ログイン(デモ)</Link>}
            />
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            ※これはポートフォリオ用デモです。実際の認証は行われません。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
