import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AccessDeniedProps {
  title: string
  description: string
  isAction: boolean
  action?: () => void
  actionLabel?: string
}

export function AccessDenied({
  title,
  description,
  isAction,
  action,
  actionLabel,
}: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl text-center max-w-md mx-auto space-y-4 shadow-xs">
      <ShieldAlert className="size-12 text-destructive animate-bounce" />
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {isAction && actionLabel && (
        <Button onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default AccessDenied
