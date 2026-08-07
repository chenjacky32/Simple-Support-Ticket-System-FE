import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-row items-center justify-between">
      <CardTitle className="font-normal border-none p-0 m-0 space-y-0 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight mt-1 text-foreground">{value}</h3>
      </CardTitle>
      <CardDescription className="rounded-lg bg-muted p-2 text-foreground m-0">
        <Icon className="size-5" />
      </CardDescription>
    </Card>
  )
}
