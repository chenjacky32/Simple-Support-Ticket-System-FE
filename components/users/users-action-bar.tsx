import * as React from "react"
import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UsersActionBarProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  setPage: (value: number) => void;
}

export function UsersActionBar({ search, setSearch, status, setStatus, setPage }: UsersActionBarProps) {
  return (
    <Card className="grid grid-cols-1 gap-4 sm:grid-cols-2 
      md:grid-cols-3 bg-card border border-border p-4 
      rounded-xl shadow-xs items-end">
      {/* Search name */}
      <Field className="space-y-1">
        <FieldLabel className="text-xs font-semibold uppercase" htmlFor="search-user">Search User</FieldLabel>
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
      </Field>

      {/* Status Dropdown */}
      <Field className="space-y-1">
        <FieldLabel className="text-xs font-semibold uppercase" htmlFor="status-filter">Activation State</FieldLabel>
        <Select
          id="status-filter"
          value={status}
          onValueChange={(e: any) => {
            setStatus(e)
            setPage(1)
          }}
        >
          <SelectTrigger id="status" className="h-9 w-full">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All Accounts</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </Card>
  )
}
