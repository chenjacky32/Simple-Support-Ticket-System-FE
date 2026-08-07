import * as React from "react"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TicketsActionButtonProps extends React.ComponentProps<typeof Button> {
  label: string;
  icon?: LucideIcon;
}

export function TicketsActionButton({
  label,
  icon: Icon,
  className,
  ...props
}: TicketsActionButtonProps) {
  return (
    <Button className={cn("gap-1.5", className)} {...props}>
      {Icon && <Icon className="size-4" />}
      {label}
    </Button>
  );
}
