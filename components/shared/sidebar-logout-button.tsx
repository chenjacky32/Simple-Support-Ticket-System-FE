import * as React from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarLogoutButtonProps {
  logout: () => void;
}

export function SidebarLogoutButton({ logout }: SidebarLogoutButtonProps) {
  return (
    <Button
      onClick={logout}
      variant={"outline"}
      className="w-full py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
    >
      <LogOut className="size-4" />
      Logout
    </Button>
  );
}
