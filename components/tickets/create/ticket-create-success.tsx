import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

export function TicketCreateSuccess() {
  return (
    <Card className="text-center py-8 space-y-4">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
        <CheckCircle2 className="size-8" />
      </div>
      <h3 className="text-xl font-bold tracking-tight">
        Ticket Created Successfully!
      </h3>
      <p className="text-sm text-muted-foreground">
        Your ticket has been recorded. Redirecting you to the ticket vault...
      </p>
      <div className="pt-2">
        <Loader2 className="size-5 animate-spin mx-auto text-muted-foreground" />
      </div>
    </Card>
  );
}
