'use client'

import DashboardLayout from "@/components/templates/dashboard"
import { useAuth } from "@/hooks/use-auth"
import { UsersHeader } from "@/components/users/users-header"
import { UsersActionBar } from "@/components/users/users-action-bar"
import { UsersLoading } from "@/components/users/users-loading"
import { UsersError } from "@/components/users/users-error"
import { UsersTable } from "@/components/users/users-table"
import { UsersPagination } from "@/components/users/users-pagination"
import { AccessDenied } from "@/components/shared/access-denied"
import { useSearchDebounce } from "@/hooks/use-search-debounce"
import { useUsers } from "@/hooks/use-users"

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();

  // Custom Hook for managing filter states
  const {
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    debouncedSearch,
  } = useSearchDebounce();

  // Custom Hook for fetching users
  const { users, meta, isLoading, error } = useUsers({
    page,
    debouncedSearch,
    status,
    enabled: currentUser?.role === "SUPERADMIN",
  });

  // Access check
  if (currentUser?.role !== "SUPERADMIN") {
    return (
      <DashboardLayout title="Access Denied">
        <AccessDenied
          title="Security Violation"
          description="You do not have administrative clearance to access this resource. User database controls are strictly restricted to system-level Administrators."
          isAction={true}
          action={() => (window.location.href = "/dashboard")}
          actionLabel="Return to Dashboard"
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        <UsersHeader />
        {/* Filters Toolbar */}
        <UsersActionBar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          setPage={setPage}
        />

        {/* Loading / Error / Content */}
        {isLoading && <UsersLoading />}

        {error && <UsersError />}

        {!isLoading && !error && (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
            {/* Table */}
            <UsersTable
              users={users}
              meta={meta}
              page={page}
              size={Number(meta?.size) || 10}
            />

            {/* Pagination Controls */}
            <UsersPagination meta={meta as any} page={page} setPage={setPage} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

