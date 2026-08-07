import DashboardLayout from "@/components/templates/dashboard"
import { AlertCircle } from "lucide-react"

export function UserDetailError() {
  return (
    <DashboardLayout title="User Details">
      <div className="flex h-64 flex-col items-center justify-center space-y-4 bg-card border border-border rounded-xl">
        <AlertCircle className="size-10 text-destructive" />
        <p className="text-muted-foreground">User not found or an error occurred.</p>
      </div>
    </DashboardLayout>
  )
}
