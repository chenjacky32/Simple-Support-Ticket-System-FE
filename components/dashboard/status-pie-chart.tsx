import { Pie, PieChart, Label } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  count: { label: "Tickets" },
  opened: { label: "Opened", color: "hsl(var(--primary))" },
  inProgress: { label: "In Progress", color: "oklch(0.795 0.184 81.112)" },
  resolved: { label: "Resolved", color: "oklch(0.556 0 0)" },
  empty: { label: "No Tickets", color: "oklch(0.922 0 0)" },
} satisfies ChartConfig;

interface StatusPieChartProps {
  total: number;
  openedCount: number;
  inProgressCount: number;
  resolvedCount: number;
}

export function StatusPieChart({ total, openedCount, inProgressCount, resolvedCount }: StatusPieChartProps) {
  const chartData = total > 0
    ? [
      { status: "opened", count: openedCount, fill: "var(--color-opened)" },
      { status: "inProgress", count: inProgressCount, fill: "var(--color-inProgress)" },
      { status: "resolved", count: resolvedCount, fill: "var(--color-resolved)" },
    ].filter((d) => d.count > 0)
    : [
      { status: "empty", count: 1, fill: "var(--color-empty)" }
    ];

  return (
    <div className="size-48 shrink-0">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full h-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-extrabold"
                      >
                        {total}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-[10px] uppercase font-bold tracking-wider"
                      >
                        Tickets
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
