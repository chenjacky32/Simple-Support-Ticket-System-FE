import Link from "next/link"
import DashboardLayout from "@/components/templates/dashboard"
import { AlertCircle } from "lucide-react"

export function TicketDetailError() {
  return (
    <DashboardLayout title="Ticket Details">
      <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive max-w-xl mx-auto">
        <AlertCircle className="size-5 shrink-0" />
        <div>
          <h4 className="font-semibold">Failed to find ticket</h4>
          <p className="text-xs text-destructive/80">The requested ticket does not exist or you lack permission to view it.</p>
          <Link href="/tickets" className="inline-block mt-3 font-semibold hover:underline">
            Return to tickets vault
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
