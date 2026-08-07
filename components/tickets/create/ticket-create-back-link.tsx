import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function TicketCreateBackLink() {
  return (
    <div className="flex items-center">
      <Link
        href="/tickets"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Tickets
      </Link>
    </div>
  )
}
