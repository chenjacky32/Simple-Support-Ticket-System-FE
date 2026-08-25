import * as React from "react"

interface SidebarContainerProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export function SidebarContainer({ isOpen, children }: SidebarContainerProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card text-card-foreground transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:z-0 lg:h-screen ${
        isOpen ? "translate-x-0 lg:ml-0" : "-translate-x-full lg:-ml-64"
      }`}
    >
      {children}
    </aside>
  );
}
