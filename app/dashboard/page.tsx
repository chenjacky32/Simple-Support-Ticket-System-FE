'use client'

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"
import { Ticket, Clock, CheckCircle2, FileText, Loader2, AlertCircle } from "lucide-react"
import { httpService } from "@/lib/services"
import { DashboardStats } from "@/types/tickets"
import DashboardLayout from "@/components/templates/dashboard"
import { DatePickerWithRange } from "@/components/date-picker-with-range"

export default function DashboardPage() {
  // Default range: Start of year to end of year
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(new Date().getFullYear(), 11, 31),
  });

  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats", date?.from, date?.to],
    queryFn: async () => {
      const params: any = {};
      if (date?.from) params.startDate = format(date.from, "yyyy-MM-dd");
      if (date?.to) params.endDate = format(date.to, "yyyy-MM-dd");
      const response = await httpService.getDashboardStats({ params });
      return response.data;
    },
    enabled: !!date?.from && !!date?.to,
  });

  // Calculate percentages fallback if statusCompositions is not present
  const total = stats?.totalTickets || 0;
  const openedCount = stats?.openedTickets || 0;
  const inProgressCount = stats?.inprogressTickets || 0;
  const resolvedCount = stats?.resolvedTickets || 0;

  const openedPct = total > 0 ? Math.round((openedCount / total) * 100) : 0;
  const progressPct = total > 0 ? Math.round((inProgressCount / total) * 100) : 0;
  const resolvedPct = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  // Donut chart segments style
  const donutGradient = {
    background: total > 0
      ? `conic-gradient(
          var(--color-primary) 0% ${openedPct}%,
          oklch(0.795 0.184 81.112) ${openedPct}% ${openedPct + progressPct}%,
          oklch(0.556 0 0) ${openedPct + progressPct}% 100%
        )`
      : "oklch(0.922 0 0)", // border fallback color if no tickets
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Top Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-xs">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Overview Statistics</h2>
            <p className="text-sm text-muted-foreground">Filter ticket aggregates by submission date</p>
          </div>
          <div>
            <DatePickerWithRange date={date} setDate={setDate} className="w-64" />
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center bg-card border border-border rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading aggregates...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            <div>
              <h4 className="font-semibold">Failed to load statistics</h4>
              <p className="text-xs text-destructive/80">Please check your connection to the server and retry.</p>
            </div>
          </div>
        )}

        {stats && !isLoading && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Tickets</p>
                  <h3 className="text-2xl font-bold tracking-tight mt-1">{total}</h3>
                </div>
                <div className="rounded-lg bg-muted p-2 text-foreground">
                  <FileText className="size-5" />
                </div>
              </div>

              {/* Opened Card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opened</p>
                  <h3 className="text-2xl font-bold tracking-tight mt-1 text-primary">{openedCount}</h3>
                </div>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Ticket className="size-5" />
                </div>
              </div>

              {/* In Progress Card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">In Progress</p>
                  <h3 className="text-2xl font-bold tracking-tight mt-1 text-amber-600">{inProgressCount}</h3>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                  <Clock className="size-5" />
                </div>
              </div>

              {/* Resolved Card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resolved</p>
                  <h3 className="text-2xl font-bold tracking-tight mt-1 text-emerald-600">{resolvedCount}</h3>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                  <CheckCircle2 className="size-5" />
                </div>
              </div>
            </div>

            {/* Chart and Composition Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Pie Chart Card */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs lg:col-span-2 flex flex-col items-center justify-center min-h-[300px]">
                <h3 className="text-sm font-semibold text-muted-foreground self-start mb-6 uppercase tracking-wider">Status Composition</h3>

                <div className="flex flex-col sm:flex-row items-center justify-around w-full gap-8">
                  {/* CSS Donut Chart */}
                  <div className="relative size-44 rounded-full shadow-xs shrink-0" style={donutGradient}>
                    <div className="absolute inset-4 rounded-full bg-card flex flex-col items-center justify-center shadow-inner">
                      <span className="text-3xl font-extrabold text-foreground">{total}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Tickets</span>
                    </div>
                  </div>

                  {/* Chart Legend */}
                  <div className="flex-1 space-y-4 max-w-xs">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-sm bg-primary" />
                        <span className="text-sm font-medium">Opened</span>
                      </div>
                      <span className="text-sm font-bold">{openedCount} ({openedPct}%)</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-sm bg-amber-500" style={{ backgroundColor: "oklch(0.795 0.184 81.112)" }} />
                        <span className="text-sm font-medium">In Progress</span>
                      </div>
                      <span className="text-sm font-bold text-amber-600">{inProgressCount} ({progressPct}%)</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-sm bg-emerald-500" style={{ backgroundColor: "oklch(0.556 0 0)" }} />
                        <span className="text-sm font-medium">Resolved</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">{resolvedCount} ({resolvedPct}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips / Summary Card */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Operational Insights</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-muted/50 p-3.5 border border-border/50 text-sm">
                      <span className="font-bold text-primary">Opened load:</span> The system currently has {openedCount} ticket(s) waiting for response assignment.
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3.5 border border-border/50 text-sm">
                      <span className="font-bold text-amber-600">Pending focus:</span> {inProgressCount} ticket(s) are actively being investigated by IT Support.
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3.5 border border-border/50 text-sm">
                      <span className="font-bold text-emerald-600">Resolution Rate:</span> {total > 0 ? Math.round((resolvedCount / total) * 100) : 0}% of all complaints submitted in this range have been successfully closed.
                    </div>
                  </div>
                </div>

                <footer className="text-[10px] text-muted-foreground text-center border-t border-border pt-4 mt-6">
                  Statistics updated dynamically based on real-time log modifications.
                </footer>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
