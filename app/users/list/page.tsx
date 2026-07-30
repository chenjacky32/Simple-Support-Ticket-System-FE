'use client'

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import { Search, Loader2, AlertCircle, CheckCircle, ShieldAlert, UserCheck, UserX } from "lucide-react"
import { api } from "@/lib/api"
import { UserProfile } from "@/types/auth"
import { useAuth } from "@/app/providers"
import DashboardLayout from "@/components/templates/dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Filters State
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [page, setPage] = React.useState(1)

  // Debounced search to avoid rapid API requests
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset page on search
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  // Fetch Users List
  const { data: responseData, isLoading, error } = useQuery<{
    status: string;
    message: string;
    meta: {
      page: string;
      size: string;
      totalRecord: string;
      totalPage: string;
      hasPrev: boolean;
      hasNext: boolean;
    };
    data: UserProfile[];
  }>({
    queryKey: ["usersList", page, debouncedSearch, status],
    queryFn: async () => {
      const params: any = {
        page: page.toString(),
        size: "10",
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status; // "active" or "inactive"

      const response = await api.get("/users/list", { params });
      return response.data;
    },
    enabled: currentUser?.role === "SUPERADMIN",
  });

  const users = responseData?.data || [];
  const meta = responseData?.meta;

  // Toggle user activation status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const response = await api.patch(`/users/${userId}/status`, { isActive });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersList"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to update user status.");
    },
  });

  const handleToggleStatus = (userId: string, currentActive: boolean) => {
    toggleStatusMutation.mutate({ userId, isActive: !currentActive });
  };

  // Define Columns for Headless TanStack Table
  const columnHelper = createColumnHelper<UserProfile>();
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => <span className="font-semibold text-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("email", {
        header: "Email Address",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("role", {
        header: "System Role",
        cell: (info) => {
          const role = info.getValue()?.toUpperCase() || "";
          let roleColor = "bg-muted text-muted-foreground";

          if (role === "SUPERADMIN" || role === "SUPER ADMIN") {
            roleColor = "bg-red-500/10 text-red-600 border border-red-500/20";
          } else if (role === "ADMIN") {
            roleColor = "bg-amber-500/10 text-amber-700 border border-amber-500/20";
          } else if (role === "USERS" || role === "USER") {
            roleColor = "bg-primary/10 text-primary border border-primary/20";
          }

          return (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${roleColor}`}>
              {role.replace("_", " ")}
            </span>
          );
        },
      }),
      columnHelper.accessor("isActive", {
        header: "Account Status",
        cell: (info) => {
          const active = info.getValue();
          return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              active 
                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" 
                : "bg-amber-500/10 text-amber-700 border-amber-500/20"
            }`}>
              {active ? "Active" : "Pending Activation"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Action Control",
        cell: (props) => {
          const userObj = props.row.original;
          const isPendingToggle = toggleStatusMutation.isPending && toggleStatusMutation.variables?.userId === userObj.id;

          // Prevent Superadmins from disabling their own accounts
          if (userObj.id === currentUser?.id) {
            return <span className="text-xs text-muted-foreground italic">Current Account</span>;
          }

          return (
            <Button
              size="sm"
              variant={userObj.isActive ? "destructive" : "default"}
              onClick={() => handleToggleStatus(userObj.id, userObj.isActive)}
              disabled={isPendingToggle}
              className="gap-1.5 h-7 text-xs"
            >
              {isPendingToggle ? (
                <Loader2 className="size-3 animate-spin" />
              ) : userObj.isActive ? (
                <>
                  <UserX className="size-3.5" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck className="size-3.5" />
                  Activate
                </>
              )}
            </Button>
          );
        },
      }),
    ],
    [toggleStatusMutation.isPending, currentUser]
  );

  // TanStack Table Instance
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  // Access check
  if (currentUser?.role !== "SUPERADMIN") {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl text-center max-w-md mx-auto space-y-4 shadow-xs">
          <ShieldAlert className="size-12 text-destructive animate-bounce" />
          <h2 className="text-xl font-bold tracking-tight">Security Violation</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You do not have administrative clearance to access this resource. User database controls are strictly restricted to system-level Administrators.
          </p>
          <Button onClick={() => window.location.href = "/dashboard"}>Return to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Registered Users Directory</h2>
          <p className="text-sm text-muted-foreground">Manage and activate client accounts and employee profiles</p>
        </div>

        {/* Filters Toolbar */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 bg-card border border-border p-4 rounded-xl shadow-xs items-end">
          {/* Search name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="search-user">Search User</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="search-user"
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="status-filter">Activation State</label>
            <select
              id="status-filter"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All Accounts</option>
              <option value="active">Active Accounts Only</option>
              <option value="inactive">Pending Activation Only</option>
            </select>
          </div>
        </div>

        {/* Loading / Error / Content */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center bg-card border border-border rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading directory...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            <div>
              <h4 className="font-semibold">Failed to fetch users</h4>
              <p className="text-xs text-destructive/80">Please check permission configurations or credentials and try again.</p>
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
                        No registered users found matching the filter criteria.
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
