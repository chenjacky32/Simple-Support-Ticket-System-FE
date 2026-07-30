import * as React from "react"
import { Card } from "@/components/ui/card"

interface PieChartContainerProps {
  children: React.ReactNode;
}

export function PieChartContainer({ children }: PieChartContainerProps) {
  return (
    <Card className="grid grid-cols-1 gap-6 border border-border">
      <div className="rounded-xl bg-card p-6 shadow-xs flex flex-col items-center justify-center">
        <h3 className="text-sm font-semibold text-muted-foreground self-start mb-6 uppercase tracking-wider">
          Status Composition
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-around w-full gap-8">
          {children}
        </div>
      </div>
    </Card>
  );
}
