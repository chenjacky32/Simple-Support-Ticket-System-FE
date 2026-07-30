'use client'

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import { Plus, Download, Search, Loader2, AlertCircle, Eye } from "lucide-react"
import { httpService } from "@/lib/services"
import { Ticket, TicketsListResponse } from "@/types/tickets"
import { useAuth } from "@/app/providers"
import DashboardLayout from "@/components/templates/dashboard"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TicketsPage() {
  const { user } = useAuth();

  // Filters State
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  // Debounced search to avoid rapid API requests
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset page on search
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  // Fetch Tickets List via Axios & React Query
  const { data: responseData, isLoading, error } = useQuery<TicketsListResponse>({
    queryKey: ["ticketsList", page, debouncedSearch, status, date?.from, date?.to],
    queryFn: async () => {
      const params: any = {
        page: page.toString(),
        size: "10",
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status;
      if (date?.from) params.startDate = format(date.from, "yyyy-MM-dd");
      if (date?.to) params.endDate = format(date.to, "yyyy-MM-dd");

      const response = await httpService.getTickets({ params });
      return response.data;
    },
  });

  const tickets = responseData?.data || [];
  const meta = responseData?.meta;

  // Export Table Data Client-Side
  const handleExport = (formatType: "csv" | "json") => {
    if (!tickets.length) return;

    if (formatType === "json") {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(tickets, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `tickets_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = ["Ticket ID", "Title", "Status", "Date Created", "Resolved At", "Created By"];
      const csvRows = [
        headers.join(","),
        ...tickets.map((t) =>
          [
            t.ticketCode,
            `"${t.title.replace(/"/g, '""')}"`,
            t.status,
            t.date,
            t.resolvedAt || "-",
            t.createdBy.name,
          ].join(",")
        ),
      ];
      const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(csvRows.join("\n"))}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", csvString);
      downloadAnchor.setAttribute("download", `tickets_export_${Date.now()}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  // Define Columns for Headless TanStack Table
  const columnHelper = createColumnHelper<Ticket>();
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("date", {
        header: "Date Created",
        cell: (info) => {
          try {
            return format(new Date(info.getValue()), "MMM dd, yyyy HH:mm");
          } catch {
            return info.getValue();
          }
        },
      }),
      columnHelper.accessor("ticketCode", {
        header: "Ticket ID",
        cell: (info) => <span className="font-mono font-semibold text-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => <span className="font-medium text-foreground line-clamp-1">{info.getValue()}</span>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const rawStatus = info.getValue()?.toUpperCase() || "";
          let badgeColor = "bg-muted text-muted-foreground";

          if (rawStatus === "OPENED" || rawStatus === "OPEN") {
            badgeColor = "bg-primary/10 text-primary border border-primary/20";
          } else if (rawStatus === "IN_PROGRESS" || rawStatus === "INPROGRESS" || rawStatus === "PROG") {
            badgeColor = "bg-amber-500/10 text-amber-700 border border-amber-500/20";
          } else if (rawStatus === "RESOLVED" || rawStatus === "RSLV") {
            badgeColor = "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20";
          }

          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${badgeColor}`}>
              {info.getValue().toLowerCase()}
            </span>
          );
        },
      }),
      columnHelper.accessor("resolvedAt", {
        header: "Resolved At",
        cell: (info) => {
          const val = info.getValue();
          if (!val) return <span className="text-muted-foreground">-</span>;
          try {
            return format(new Date(val), "MMM dd, yyyy");
          } catch {
            return val;
          }
        },
      }),
      columnHelper.accessor("createdBy.name", {
        header: "Submitted By",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (props) => (
          <Link href={`/tickets/${props.row.original.id}`}>
            <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs">
              <Eye className="size-3.5" />
              Details
            </Button>
          </Link>
        ),
      }),
    ],
    []
  );

  // TanStack Table Headless Core Instance
  const table = useReactTable({
    data: tickets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const isAdminOrSuper = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  return (
    <DashboardLayout title="Tickets Vault">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Support Tickets</h2>
            <p className="text-sm text-muted-foreground">Manage and filter user complaints</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdminOrSuper && tickets.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={() => handleExport("csv")} className="gap-1.5">
                  <Download className="size-4" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport("json")} className="gap-1.5">
                  <Download className="size-4" />
                  JSON
                </Button>
              </>
            )}
            {user?.role === "USERS" && (
              <Link href="/tickets/create">
                <Button size="sm" className="gap-1.5">
                  <Plus className="size-4" />
                  Create Ticket
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 bg-card border border-border p-4 rounded-xl shadow-xs items-end">
          {/* Search Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="search">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Search ticket title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All Statuses</option>
              <option value="Opened">Opened</option>
              <option value="Inprogress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="sm:col-span-2">
            <DatePickerWithRange date={date} setDate={(d) => {
              setDate(d)
              setPage(1)
            }} className="w-full" />
          </div>
        </div>

        {/* Loading / Error / Content */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center bg-card border border-border rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading tickets...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            <div>
              <h4 className="font-semibold">Failed to fetch tickets</h4>
              <p className="text-xs text-destructive/80">Please check your network credentials and try again.</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
            {/* Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left text-sm text-foreground">
                <thead className="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="p-4 font-semibold">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-border">
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-4 align-middle">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="p-8 text-center text-muted-foreground">
                        No support tickets found for the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {meta && parseInt(meta.totalPage) > 1 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  Showing page <strong>{meta.page}</strong> of <strong>{meta.totalPage}</strong> ({meta.totalRecord} records)
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={!meta.hasPrev}
                  >
                    Previous
                  </Button>

                  {/* Generate numbers */}
                  {Array.from({ length: parseInt(meta.totalPage) }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={page === pageNum ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  ))}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(p + 1, parseInt(meta.totalPage)))}
                    disabled={!meta.hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}