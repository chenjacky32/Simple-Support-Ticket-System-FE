import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { TicketDetail } from "@/types/tickets"
import React from "react"

interface TicketDetailHeaderProps {
  ticket: TicketDetail;
  badgeColor: string;
  isAdminOrSuper: boolean;
  rawStatus: string;
  statusMutation: any;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function TicketDetailHeader({
  ticket,
  badgeColor,
  isAdminOrSuper,
  rawStatus,
  statusMutation,
  handleStatusChange,
}: TicketDetailHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-border pb-6">
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Ticket <span className="underline underline-offset-2">#{ticket.ticketCode}</span> - {ticket.title}</h2>
          <Badge className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${badgeColor}`}>
            {ticket.status.toUpperCase().replace('_', ' ')}
          </Badge>
        </div>
        {/* Submitted On and Created By */}
        <div className="flex flex-col gap-1 mt-2">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Submitted on:</span> {format(new Date(ticket.date), "PPP p")}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Created by:</span> {ticket.createdBy.name} ({ticket.createdBy.email})
          </p>
        </div>
      </div>

      {/* Admin status controller */}
      {isAdminOrSuper && (
        <div className="flex flex-col gap-1.5 shrink-0 bg-muted/30 border border-border p-3 rounded-lg">
          <label className="text-xs font-bold text-muted-foreground uppercase" htmlFor="change-status">Change Status</label>
          <div className="flex items-center gap-2">
            <select
              id="change-status"
              value={rawStatus === "OPEN" ? "Opened" : rawStatus === "IN_PROGRESS" || rawStatus === "INPROGRESS" ? "Inprogress" : "Resolved"}
              onChange={handleStatusChange}
              disabled={statusMutation.isPending}
              className="h-8 rounded-md border border-input bg-card px-2.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="OPENED">Opened</option>
              <option value="INPROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            {statusMutation.isPending && <Loader2 className="size-4 animate-spin text-primary" />}
          </div>
        </div>
      )}
    </div>
  )
}
