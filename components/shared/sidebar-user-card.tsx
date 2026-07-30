import * as React from "react"
import { type UserProfile } from "@/types/auth"
import { SidebarLogoutButton } from "@/components/shared/sidebar-logout-button"

interface SidebarUserCardProps {
  user: UserProfile;
  logout: () => void;
  roleLabel: string;
}

export function SidebarUserCard({ user, logout, roleLabel }: SidebarUserCardProps) {
  return (
    <div className="border-t border-border p-4 bg-muted/40">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate leading-none mb-1">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate leading-none mb-1">{user.email}</p>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {roleLabel}
          </span>
        </div>
      </div>
      <SidebarLogoutButton logout={logout} />
    </div>
  );
}
