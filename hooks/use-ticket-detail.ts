import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { httpService } from "@/lib/services";
import { TicketDetail } from "@/types/tickets";
import { type ReplyInput, replySchema } from "@/schemas/ticket";

export function useTicketDetail(ticketId: string, user: any) {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Fetch Ticket details & replies
  const { data: ticket, isLoading, error } = useQuery<TicketDetail>({
    queryKey: ["ticketDetail", ticketId],
    queryFn: async () => {
      const response = await httpService.getTicketDetails(ticketId);
      return response.data;
    },
    enabled: !!ticketId,
  });

  // Reply Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyInput>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      message: "",
    },
  });

  // Mutation to Post a reply
  const replyMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await httpService.replyTicket(ticketId, { message });
      return response.data;
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["ticketDetail", ticketId] });
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || "Failed to post reply.");
    },
  });

  // Mutation to Update status (Admin/Superadmin)
  const statusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const response = await httpService.updateTicketStatus(ticketId, { status: newStatus });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketDetail", ticketId] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to update ticket status.");
    },
  });

  const onSubmitReply = (data: ReplyInput) => {
    setErrorMsg(null);
    if (user?.role !== "ADMIN") return;
    replyMutation.mutate(data.message);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      if (user?.role !== "ADMIN") return;
      statusMutation.mutate(selected);
    }
  };

  return {
    ticket,
    isLoading,
    error,
    errorMsg,
    register,
    handleSubmit,
    errors,
    replyMutation,
    statusMutation,
    onSubmitReply,
    handleStatusChange,
  };
}
