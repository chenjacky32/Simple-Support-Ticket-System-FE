import * as React from "react"
import Link from "next/link"
import { Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TicketsActionButton } from "@/components/tickets/tickets-action-button"

interface TicketsActionBarProps {
  isAdminOrSuper: boolean;
  hasTickets: boolean;
  handleExport: (format: "csv" | "json") => void;
  userRole?: string;
}

export function TicketsActionBar({ isAdminOrSuper, hasTickets, handleExport, userRole }: TicketsActionBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Support Tickets</h2>
        <p className="text-sm text-muted-foreground">Manage and filter user complaints</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isAdminOrSuper && hasTickets && (
          <React.Fragment>

            <TicketsActionButton variant="outline" size="sm" onClick={() => handleExport("csv")} icon={Download} label="CSV" />
            <TicketsActionButton variant="outline" size="sm" onClick={() => handleExport("json")} icon={Download} label="JSON" />          </React.Fragment>
        )}
        {userRole === "USERS" && (
          <Link href="/tickets/create">
            <TicketsActionButton size="sm" icon={Plus} label="Create Ticket" />
          </Link>
        )}
      </div>
    </div>
  );
}
