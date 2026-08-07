import * as React from "react"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { UserProfile } from "@/types/auth"
import { UsersColumns } from "@/components/users/users-columns"

interface UsersTableProps {
  users: UserProfile[];
  meta?: any;
  size?: number;
  page?: number;
}

export function UsersTable({ users = [], meta, size = 10, page = 1 }: UsersTableProps) {
  const currentPage = page || Number(meta?.page) || 1;
  const currentSize = size || Number(meta?.size) || 10;

  const columns = React.useMemo(
    () => UsersColumns(currentPage, currentSize),
    [currentPage, currentSize]
  );

  const table = useReactTable({
    data: users,
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
                No registered users found matching the filter criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
