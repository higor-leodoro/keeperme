"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  Users,
  LogOut,
  Bell,
} from "lucide-react";
import { mockUser, mockInvites } from "@/lib/mock-data";
import { ToastProvider } from "@/components/toast-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/login/_actions/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/categories", label: "Categories", icon: Tag },
  { href: "/groups", label: "Groups", icon: Users },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/categories": "Categories",
  "/groups": "Groups",
};

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const initials = `${mockUser.name[0]}${mockUser.lastName[0]}`;

  return (
    <aside className="fixed left-0 top-0 flex flex-col w-[220px] h-screen bg-surface border-r border-border z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 h-16 px-5 border-b border-border">
        <Image src="/logo.png" alt="Keeperme" width={32} height={28} />
        <span className="text-[13px] font-bold tracking-[3px] text-primary">
          KEEPERME
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col p-3 px-2 gap-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/groups" && pathname.startsWith("/groups"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center h-10 px-3 rounded-md text-sm font-medium gap-2.5 no-underline transition-all border-l-2",
                isActive
                  ? "text-primary bg-surface-2 border-l-primary pl-2.5"
                  : "text-muted-foreground bg-transparent border-l-transparent hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto p-2 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-surface-2 transition-colors cursor-pointer bg-transparent border-none text-left">
              <div className="flex items-center justify-center shrink-0 size-8 rounded-full bg-surface-3 text-[13px] font-semibold text-primary">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-primary truncate">
                  {mockUser.name} {mockUser.lastName}
                </div>
                <div className="text-[11px] text-text-muted truncate">
                  {mockUser.email}
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-[200px]">
            <DropdownMenuItem
              className="text-muted-foreground cursor-pointer"
              onClick={async () => {
                await logoutAction();
                router.push("/login");
              }}
            >
              <LogOut size={16} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

function TopBar() {
  const pathname = usePathname();
  const title =
    pageTitles[pathname] ||
    (pathname.startsWith("/groups/") ? "Group Details" : "");
  const initials = `${mockUser.name[0]}${mockUser.lastName[0]}`;
  const hasPendingInvites = mockInvites.length > 0;

  return (
    <header className="flex items-center justify-between h-[60px] px-8 border-b border-border">
      <h1 className="text-lg font-semibold text-primary">{title}</h1>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {hasPendingInvites && (
            <span className="flex items-center justify-center absolute top-0 right-0 size-4 rounded-full bg-primary text-black text-[10px] font-semibold">
              {mockInvites.length}
            </span>
          )}
        </Button>
        <div className="flex items-center justify-center size-8 rounded-full bg-surface-3 text-[13px] font-semibold text-primary">
          {initials}
        </div>
      </div>
    </header>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 ml-[220px]">
          <TopBar />
          <main className="p-8 overflow-y-auto flex-1">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
