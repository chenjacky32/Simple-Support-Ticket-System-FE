import { format } from "date-fns"
import { TicketDetail } from "@/types/tickets"
import React from "react"

interface TicketDetailTimelineProps {
  ticket: TicketDetail;
}

export function TicketDetailTimeline({ ticket }: TicketDetailTimelineProps) {
  return (
    <div className="space-y-4 p-4 ">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Responses History</h3>

      <div className="space-y-4">
        {ticket.replies && ticket.replies.length > 0 ? (
          ticket.replies.map((reply) => {
            const isSupport = reply.createdBy.role === "ADMIN" || reply.createdBy.role === "SUPERADMIN" || reply.createdBy.role === "SUPER ADMIN";
            return (
              <div
                key={reply.id}
                className={`flex gap-3 max-w-[85%] ${isSupport ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* User Icon indicator */}
                <div className={`size-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${isSupport ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground border border-border"
                  }`}>
                  {isSupport ? "SUP" : reply.createdBy.name.slice(0, 2).toUpperCase()}
                </div>

                {/* Chat Bubble container */}
                <div className={`rounded-xl border p-4 shadow-xs space-y-1.5 ${isSupport
                  ? "bg-card border-border text-foreground"
                  : "bg-primary text-primary-foreground border-transparent"
                  }`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold">{reply.createdBy.name}</span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${isSupport
                      ? "bg-primary/10 text-primary"
                      : "bg-primary-foreground/20 text-primary-foreground"
                      }`}>
                      {isSupport ? "Admin" : "Users"}
                    </span>
                    <span className={`text-[9px] ${isSupport ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
                      {format(new Date(reply.createdAt), "MMM dd, p")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{reply.message}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground bg-card border border-border rounded-xl">
            No replies have been recorded yet. Submitting a reply will notify relevant parties.
          </div>
        )}
      </div>
    </div>
  )
}
