import * as React from "react"

export function UsersHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Registered Users Directory</h2>
        <p className="text-sm text-muted-foreground">Manage and activate client accounts and employee profiles</p>
      </div>
    </div>
  )
}
