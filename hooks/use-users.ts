import { useQuery } from "@tanstack/react-query"
import { httpService } from "@/lib/services"
import { UserProfile } from "@/types/auth"

interface UseUsersProps {
  page: number;
  debouncedSearch: string;
  status: string;
  enabled?: boolean;
}

export function useUsers({ page, debouncedSearch, status, enabled = true }: UseUsersProps) {
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
      if (status) params.status = status; // "ACTIVE" or "INACTIVE"

      const response = await httpService.getUsersList(params);
      return response;
    },
    enabled,
  });

  return {
    users: responseData?.data || [],
    meta: responseData?.meta,
    isLoading,
    error,
  };
}
