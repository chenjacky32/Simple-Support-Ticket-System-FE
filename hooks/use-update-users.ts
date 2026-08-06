import { useMutation, useQueryClient } from "@tanstack/react-query"
import { httpService } from "@/lib/services"

export function useUpdateUsers() {
  const queryClient = useQueryClient();

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const response = await httpService.updateTicketStatus(userId, {
        status: isActive.toString()
      })

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

  return {
    toggleStatusMutation,
    handleToggleStatus,
    isPending: toggleStatusMutation.isPending,
  };
}
