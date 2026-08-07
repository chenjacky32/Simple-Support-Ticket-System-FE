import { useQuery } from "@tanstack/react-query";
import { httpService } from "@/lib/services";
import { UserDetail } from "@/types/users";

export function useUserDetail(userId: string) {
  const { data: user, isLoading, error } = useQuery<UserDetail>({
    queryKey: ["userDetail", userId],
    queryFn: async () => {
      const response = await httpService.getUserDetails(userId);
      return response.data;
    },
    enabled: !!userId,
  });

  return {
    user,
    isLoading,
    error,
  };
}
