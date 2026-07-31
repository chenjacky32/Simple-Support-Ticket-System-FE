import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { type DateRange } from "react-day-picker"
import { format, parse } from "date-fns"

export function useSearchDebounce() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 1. Initialize state FROM URL
  const [search, setSearch] = React.useState(searchParams.get("search") || "")
  const [status, setStatus] = React.useState(searchParams.get("status") || "")
  const [page, setPage] = React.useState(Number(searchParams.get("page")) || 1)
  
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const fromStr = searchParams.get("from")
    const toStr = searchParams.get("to")
    return {
      from: fromStr ? parse(fromStr, "yyyy-MM-dd", new Date()) : undefined,
      to: toStr ? parse(toStr, "yyyy-MM-dd", new Date()) : undefined,
    }
  })

  // Debounced search to avoid rapid API requests
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      if (search !== (searchParams.get("search") || "")) {
        setPage(1) // Reset page when typing new search
      }
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  // 2. Sync state TO URL dynamically
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (debouncedSearch) params.set("search", debouncedSearch)
    else params.delete("search")
    
    if (status) params.set("status", status)
    else params.delete("status")
    
    if (page > 1) params.set("page", page.toString())
    else params.delete("page")
    
    if (date?.from) params.set("from", format(date.from, "yyyy-MM-dd"))
    else params.delete("from")
    
    if (date?.to) params.set("to", format(date.to, "yyyy-MM-dd"))
    else params.delete("to")

    // Update URL silently without full page reload
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [debouncedSearch, status, page, date, pathname, router])

  return {
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    date,
    setDate,
    debouncedSearch,
  }
}
