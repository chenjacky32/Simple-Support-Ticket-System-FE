import * as React from "react"
import Link from "next/link"
import { X } from "lucide-react"

interface SidebarBrandProps {
  onClose: () => void;
  icon: string;
  brands: string;
}

export function SidebarBrand({ onClose, icon, brands }: SidebarBrandProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-border px-6">
      <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          {icon}
        </div>
        <span className="font-semibold text-lg tracking-tight">{brands}</span>
      </Link>
      <button
        className="rounded-md p-1.5 hover:bg-muted"
        onClick={onClose}
        aria-label="Close menu"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
