'use client'

import DashboardLayout from "@/components/templates/dashboard"
import { Ticket, Clock, CheckCircle2, FileText } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { StatCard } from "@/components/dashboard/stat-card"
import { OverviewFilters } from "@/components/dashboard/overview-filters"
import { StatusPieChart } from "@/components/dashboard/status-pie-chart"
import { StatusLegendItem } from "@/components/dashboard/status-legend-item"
import { PieChartContainer } from "@/components/dashboard/pie-chart-container"
import { DashboardLoading } from "@/components/dashboard/dashboard-loading"
import { DashboardError } from "@/components/dashboard/dashboard-error"
import { Suspense } from "react"

function DashboardPageContent() {
  const {
    date,
    setDate,
    stats,
    isLoading,
    error,
    total,
    openedCount,
    inProgressCount,
    resolvedCount,
    openedPct,
    resolvedPct,
    progressPct,
  } = useDashboardStats();

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Top Filters */}
        <OverviewFilters date={date} setDate={setDate} />

        {/* Loading / Error States */}
        {isLoading && <DashboardLoading />}
        {error && <DashboardError />}

        {stats && !isLoading && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Tickets" value={total} icon={FileText} />
              <StatCard title="Opened" value={openedCount} icon={Ticket} />
              <StatCard title="In Progress" value={inProgressCount} icon={Clock} />
              <StatCard title="Resolved" value={resolvedCount} icon={CheckCircle2} />
            </div>

            {/* Pie Chart Card */}
            <PieChartContainer>
              {/* Recharts Donut Chart */}
              <StatusPieChart
                total={total}
                openedCount={openedCount}
                inProgressCount={inProgressCount}
                resolvedCount={resolvedCount}
              />

              {/* Chart Legend */}
              <div className="flex-1 space-y-4 max-w-xs">
                <StatusLegendItem variant="opened" count={openedCount} pct={openedPct} />
                <StatusLegendItem variant="inProgress" count={inProgressCount} pct={progressPct} />
                <StatusLegendItem variant="resolved" count={resolvedCount} pct={resolvedPct} />
              </div>
            </PieChartContainer>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardPageContent />
    </Suspense>
  )
}
