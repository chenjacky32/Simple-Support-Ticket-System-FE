import { AlertCircle } from "lucide-react"

export function DashboardError() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
      <AlertCircle className="size-5 shrink-0" />
      <div>
        <h4 className="font-semibold">Failed to load statistics</h4>
        <p className="text-xs text-destructive/80">Please check your connection to the server and retry.</p>
      </div>
    </div>
  );
}
