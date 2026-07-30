'use client'

import * as React from "react"
import { Menu, Sun, Moon } from "lucide-react"
import { useAuth, useTheme } from "@/app/providers"

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-muted lg:hidden text-foreground"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight text-foreground capitalize">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle theme mode"
        >
          {theme === "light" ? (
            <Moon className="size-5" />
          ) : (
            <Sun className="size-5" />
          )}
        </button>

        {/* User Status / Avatar */}
        {user && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm font-medium text-foreground">{user.name}</span>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
