import { AlertCircle } from "lucide-react"

export function UsersError() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
      <AlertCircle className="size-5 shrink-0" />
      <div>
        <h4 className="font-semibold">Failed to fetch users</h4>
        <p className="text-xs text-destructive/80">Please check permission configurations or credentials and try again.</p>
      </div>
    </div>
  )
}
