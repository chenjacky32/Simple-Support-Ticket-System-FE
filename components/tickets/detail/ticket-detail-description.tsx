import { Paperclip } from "lucide-react"
import { TicketDetail } from "@/types/tickets"
import React from "react"

interface TicketDetailDescriptionProps {
  ticket: TicketDetail;
}

export function TicketDetailDescription({ ticket }: TicketDetailDescriptionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold tracking-tight border-b border-border pb-6">Description</h3>
      <div className="text-sm text-foreground whitespace-pre-line leading-relaxed bg-muted/10 border border-border/50 rounded-lg p-4">
        <div className="border-b border-border pb-6 mb-6">
          <p>{ticket.description}</p>
        </div>

        {ticket.attachmentPath && (
          <div className="flex items-center gap-2 text-xs border border-border bg-muted/40 p-2.5 rounded-lg w-fit">
            <Paperclip className="size-4 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">Attachment:</span>
            <a
              href={`#`}
              onClick={(e) => {
                e.preventDefault();
                alert(`Downloading simulated attachment path: ${ticket.attachmentPath}`);
              }}
              className="font-bold text-primary hover:underline"
            >
              {ticket.attachmentPath.split("/").pop()}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
