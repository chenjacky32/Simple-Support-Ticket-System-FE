import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { type DateRange } from "react-day-picker"
import { Card } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TicketsFilterToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  date: DateRange | undefined;
  setDate: (val: DateRange | undefined) => void;
  setPage: (val: number) => void;
}

export function TicketsFilterToolbar({ search, setSearch, status, setStatus, date, setDate, setPage }: TicketsFilterToolbarProps) {
  return (
    <Card className="grid grid-cols-1 gap-4 sm:grid-cols-2 
      md:grid-cols-4 bg-card border border-border p-4 
      rounded-xl shadow-xs items-end">
      {/* Search Input */}
      <Field>
        <FieldLabel className="text-xs font-semibold uppercase" htmlFor="search">Search</FieldLabel>
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
      </Field>

      {/* Status Dropdown */}
      <Field>
        <FieldLabel htmlFor="status" className="text-xs font-semibold uppercase">Status</FieldLabel>
        <div className="relative">
          <Select
            value={status || "ALL"}
            onValueChange={(val) => {
              setStatus(val === "ALL" || !val ? "" : val)
              setPage(1)
            }}
          >
            <SelectTrigger id="status" className="h-9 w-full">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="OPENED">OPENED</SelectItem>
                <SelectItem value="INPROGRESS">INPROGRESS</SelectItem>
                <SelectItem value="RESOLVED">RESOLVED</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Field>

      {/* Date Picker */}
      <div className="sm:col-span-2">
        <DatePickerWithRange
          date={date}
          setDate={(d) => {
            setDate(d)
            setPage(1)
          }}
          className="w-full"
          labelClassName="text-xs font-semibold uppercase"
          buttonClassName="h-9"
        />
      </div>
    </Card>
  );
}
