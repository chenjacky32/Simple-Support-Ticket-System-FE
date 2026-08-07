import Link from "next/link"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TicketCreateActionsProps {
  isPending: boolean
}

export function TicketCreateActions({ isPending }: TicketCreateActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-border">
      <Link href="/tickets">
        <Button variant="outline" type="button" disabled={isPending}>
          Cancel
        </Button>
      </Link>
      <Button type="submit" disabled={isPending} className="gap-2">
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Submit Ticket
          </>
        )}
      </Button>
    </div>
  )
}
