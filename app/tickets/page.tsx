'use client'

import DashboardLayout from "@/components/templates/dashboard"
import { TicketsActionBar } from "@/components/tickets/tickets-action-bar"
import { TicketsFilterToolbar } from "@/components/tickets/tickets-filter-toolbar"
import { TicketsLoading } from "@/components/tickets/tickets-loading"
import { TicketsError } from "@/components/tickets/tickets-error"
import { TicketsTable } from "@/components/tickets/tickets-table"
import { TicketsPagination } from "@/components/tickets/tickets-pagination"
import { ticketHelper } from "@/lib/helper"
import { useAuth } from "@/hooks/use-auth"
import { useSearchDebounce } from "@/hooks/use-search-debounce"
import { useTickets } from "@/hooks/use-tickets"

export default function TicketsPage() {
  const { user } = useAuth();

  // Custom Hook for managing filter states
  const {
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    date,
    setDate,
    debouncedSearch,
  } = useSearchDebounce();

  // Custom Hook for fetching tickets
  const { tickets, meta, isLoading, error } = useTickets({
    page,
    debouncedSearch,
    status,
    date,
  });

  const handleExport = (formatType: "csv" | "json") => {
    ticketHelper.exportTickets(tickets, formatType);
  };

  const isAdminOrSuper = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  return (
    <DashboardLayout title="Tickets List">
      <div className="space-y-6">
        {/* Actions Bar */}
        <TicketsActionBar
          isAdminOrSuper={isAdminOrSuper}
          hasTickets={tickets.length > 0}
          handleExport={handleExport}
          userRole={user?.role}
        />

        {/* Filter Toolbar */}
        <TicketsFilterToolbar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          date={date}
          setDate={setDate}
          setPage={setPage}
        />

        {/* Loading / Error / Content */}
        {isLoading && <TicketsLoading />}

        {error && <TicketsError />}

        {!isLoading && !error && (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
            {/* Table */}
            <TicketsTable tickets={tickets} page={page} size={meta?.size} />

            {/* Pagination Controls */}
            <TicketsPagination meta={meta} page={page} setPage={setPage} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}