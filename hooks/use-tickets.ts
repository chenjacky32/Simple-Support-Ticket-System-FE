import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"
import { httpService } from "@/lib/services"
import { TicketsListResponse, ResponseMeta } from "@/types/tickets"

interface UseTicketsProps {
  page: number;
  debouncedSearch: string;
  status: string;
  date: DateRange | undefined;
}

export function useTickets({ page, debouncedSearch, status, date }: UseTicketsProps) {
  const { data, isLoading, error } = useQuery<TicketsListResponse>({
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

      const response = await httpService.getTicketsList(params);
      return response;
    },
  });

  return {
    isLoading: isLoading,
    error: error,
    tickets: data?.data || [],
    meta: data?.meta || {} as ResponseMeta,
  };
}
