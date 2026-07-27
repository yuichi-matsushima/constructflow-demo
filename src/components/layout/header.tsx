"use client";

import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notifications } from "@/lib/mock-data";

export function Header() {
  const router = useRouter();
  const warningCount = notifications.filter((n) => n.level === "warning").length;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <p className="text-sm text-muted-foreground">工務店向け業務管理デモ</p>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent">
            <Bell className="h-4 w-4" />
            {warningCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-4 min-w-4 justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
                {warningCount}
              </Badge>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>通知</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 whitespace-normal">
                <span
                  className={
                    n.level === "warning"
                      ? "text-destructive"
                      : "text-foreground"
                  }
                >
                  {n.message}
                </span>
                <span className="text-xs text-muted-foreground">{n.at}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-md px-2 py-1 text-sm hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback>高</AvatarFallback>
            </Avatar>
            <span className="hidden font-medium sm:inline">高橋 直人</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>営業担当</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/login")}>
              ログイン画面を見る
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
