'use client'

import * as React from "react"
import Sidebar from "@/components/templates/sidebar"
import Header from "@/components/templates/header"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardLayout({
  children,
  title = "Dashboard",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    // Auto-close sidebar on smaller screens
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading SimpleTicket...</p>
        </div>
      </div>
    );
  }

  // Guard routing fallback
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />

        {/* Scrollable Work Area */}
        <main className="w-full flex-1 overflow-y-auto p-6 md:p-8 bg-muted/10 mx-auto">
          <div className="mx-auto mb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
