import * as React from "react"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Ticket } from "@/types/tickets"
import { TicketsColumns } from "@/components/tickets/tickets-columns"

interface TicketsTableProps {
  tickets: Ticket[];
  page?: number;
  size?: number;
}

export function TicketsTable({ tickets = [], page = 1, size = 10 }: TicketsTableProps) {
  const columns = React.useMemo(() => TicketsColumns(page, size), [page, size]);

  const table = useReactTable({
    data: tickets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="overflow-x-auto w-full shadow-xs border border-border rounded-lg">
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
  );
}
