"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <p className="text-sm text-muted-foreground">工務店向け業務管理デモ</p>
      </div>
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
    </header>
  );
}
