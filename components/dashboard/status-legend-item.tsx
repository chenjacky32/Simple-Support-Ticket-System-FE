import * as React from "react"

export type LegendVariant = "opened" | "inProgress" | "resolved";

interface StatusLegendItemProps {
  variant: LegendVariant;
  count: number | string;
  pct: number | string;
}

const variantConfig = {
  opened: {
    label: "Opened",
    colorClass: "bg-primary",
    style: {},
  },
  inProgress: {
    label: "In Progress",
    colorClass: "",
    style: { backgroundColor: "oklch(0.795 0.184 81.112)" },
  },
  resolved: {
    label: "Resolved",
    colorClass: "",
    style: { backgroundColor: "oklch(0.556 0 0)" },
  },
};

export function StatusLegendItem({ variant, count, pct }: StatusLegendItemProps) {
  const config = variantConfig[variant];

  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <div className="flex items-center gap-2">
        <div className={`size-3 rounded-sm ${config.colorClass}`} style={config.style} />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
      <span className="text-sm font-bold">{count} ({pct}%)</span>
    </div>
  );
}
