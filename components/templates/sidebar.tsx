'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Ticket, PlusCircle, Users, LogOut, X } from "lucide-react"
import { useAuth } from "@/app/providers"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const role = user.role.toUpperCase();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["USERS", "ADMIN", "SUPERADMIN"],
    },
    {
      title: "Tickets",
      href: "/tickets",
      icon: Ticket,
      roles: ["USERS", "ADMIN", "SUPERADMIN"],
    },
    {
      title: "Create Ticket",
      href: "/tickets/create",
      icon: PlusCircle,
      roles: ["USERS"], // only regular users can create tickets
    },
    {
      title: "User Management",
      href: "/users/list",
      icon: Users,
      roles: ["SUPERADMIN"], // only superadmin manages users
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  const roleLabels: Record<string, string> = {
    USERS: "Client",
    ADMIN: "IT Support / Admin",
    SUPERADMIN: "Super Admin",
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card text-card-foreground transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-0 lg:h-screen`}
      >
        {/* Brand / Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              ST
            </div>
            <span className="font-semibold text-lg tracking-tight">SimpleTicket</span>
          </Link>
          <button
            className="rounded-md p-1.5 hover:bg-muted lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="border-t border-border p-4 bg-muted/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-none mb-1">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate leading-none mb-1">{user.email}</p>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {roleLabels[role] || role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
