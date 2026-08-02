import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { format, parseISO } from "date-fns"
import { type DateRange } from "react-day-picker"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { httpService } from "@/lib/services"
import { DashboardStats } from "@/types/dashboard"

export function useDashboardStats() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const startParam = searchParams.get("startDate");
    const endParam = searchParams.get("endDate");

    if (startParam && endParam) {
      // Use parseISO or simply new Date(startParam) if it's in yyyy-MM-dd format
      return {
        from: new Date(startParam),
        to: new Date(endParam),
      };
    }

    return {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    };
  });

  // Sync state changes to URL
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (date?.from) {
      params.set("startDate", format(date.from, "yyyy-MM-dd"));
    } else {
      params.delete("startDate");
    }

    if (date?.to) {
      params.set("endDate", format(date.to, "yyyy-MM-dd"));
    } else {
      params.delete("endDate");
    }

    // Update URL query parameters without triggering full page reload
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [date, pathname, router]); // deliberately excluding searchParams from dependencies to avoid infinite loops on manual typing


  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats", date?.from, date?.to],
    queryFn: async () => {
      const params: any = {};
      if (date?.from) params.startDate = format(date.from, "yyyy-MM-dd");
      if (date?.to) params.endDate = format(date.to, "yyyy-MM-dd");

      const data = await httpService.getDashboardStats(params);
      return data?.data || data;
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

  return {
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
    progressPct,
    resolvedPct
  }
}
