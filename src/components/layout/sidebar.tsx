"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  CalendarDays,
  HardHat,
  UserSquare2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/projects", label: "案件管理", icon: Building2 },
  { href: "/customers", label: "顧客管理", icon: Users },
  { href: "/estimates", label: "見積もり", icon: FileText },
  { href: "/schedule", label: "スケジュール", icon: CalendarDays },
  { href: "/staff", label: "スタッフ管理", icon: UserSquare2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <HardHat className="h-6 w-6 text-sidebar-primary" />
        <span className="font-heading text-lg font-semibold tracking-tight">
          ConstructFlow
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-xs text-sidebar-foreground/60">
        デモ環境 / サンプルデータ表示中
      </div>
    </aside>
  );
}
