import { AlertCircle } from "lucide-react";

interface TicketCreateErrorAlertProps {
  message: string;
}

export function TicketCreateErrorAlert({
  message,
}: TicketCreateErrorAlertProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg 
          border border-destructive/20 bg-destructive/10 
          p-4 text-sm text-destructive"
    >
      <AlertCircle className="size-4 shrink-0" />
      <p className="font-medium">{message}</p>
    </div>
  );
}
