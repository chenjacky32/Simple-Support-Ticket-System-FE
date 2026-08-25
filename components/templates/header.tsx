'use client'

import * as React from "react"
import { Menu, Sun, Moon } from "lucide-react"
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full flex h-16 sticky top-0 z-40 items-center 
            justify-between border-b border-border 
            bg-card p-6 md:p-8 mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-muted text-foreground"
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
            <span className="hidden sm:inline text-sm font-medium text-foreground">Hello, {user.name}</span>
            {/* <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
              {user.name.slice(0, 2).toUpperCase()}
            </div> */}
          </div>
        )}
      </div>
    </header>
  );
}
