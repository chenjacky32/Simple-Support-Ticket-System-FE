import DashboardLayout from "@/components/templates/dashboard"
import { Loader2 } from "lucide-react"

export function UserDetailLoading() {
  return (
    <DashboardLayout title="User Details">
      <div className="flex h-64 items-center justify-center bg-card border border-border rounded-xl">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  )
}
