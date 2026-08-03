import { Loader2 } from "lucide-react"

export function TicketsLoading() {
  return (
    <div className="flex h-64 items-center justify-center bg-card border border-border rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading tickets...</p>
      </div>
    </div>
  );
}
