'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Ticket, PlusCircle, Users, LogOut, X } from "lucide-react"
import { SidebarContainer } from "@/components/shared/sidebar-container"
import { useAuth } from "@/app/providers"
import { SidebarBrand } from "@/components/shared/sidebar-brand"
import { SidebarUserCard } from "@/components/shared/sidebar-user-card"


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
    USERS: "Users",
    ADMIN: "Admin",
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
      <SidebarContainer isOpen={isOpen}>
        <SidebarBrand onClose={onClose}
          icon={"ST"}
          brands={"SimpleTicket"}
        />

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {filteredItems.map((item) => {
            const bestMatch = filteredItems.reduce((best, navItem) => {
              if (pathname === navItem.href || pathname.startsWith(navItem.href + "/")) {
                return navItem.href.length > best.length ? navItem.href : best;
              }
              return best;
            }, "");

            const Icon = item.icon;
            const isActive = item.href === bestMatch;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
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
        <SidebarUserCard
          user={user}
          logout={logout}
          roleLabel={roleLabels[role] || role}
        />
      </SidebarContainer>
    </>
  );
}
