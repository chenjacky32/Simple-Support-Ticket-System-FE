import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { httpService } from "@/lib/services";
import { ticketSchema, type TicketInput } from "@/schemas/ticket";

export function useCreateTickets() {
  const [success, setSuccess] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const { user } = useAuth();
  const isUsers = user?.role === "USERS";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      attachmentPath: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TicketInput) => {
      return await httpService.createTicket(data);
    },
    onSuccess: (data) => {
      if (data.status == "success") {
        setSuccess(true);
        reset();
        setFileName(null);
        setTimeout(() => {
          router.push("/tickets");
        }, 1500);
      } else {
        setErrorMsg(data.message || "Failed to create ticket.");
        return;
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Failed to submit ticket. Please check fields.";
      setErrorMsg(message);
    },
  });

  const onSubmit = (data: TicketInput) => {
    setErrorMsg(null);
    if (!isUsers) {
      setErrorMsg("You do not have permission to create tickets.");
      return;
    }
    mutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fileAttachmentPath = file
      ? `attachments/${Date.now()}_${file.name}`
      : "";
    if (file) {
      setFileName(file.name);
      // Simulate file upload setting an attachment path string
      setValue("attachmentPath", fileAttachmentPath);
    }
  };

  return {
    success,
    errorMsg,
    fileName,
    register,
    mutationError: mutation.isError,
    mutationPending: mutation.isPending,
    handleSubmit,
    errors,
    onSubmit,
    handleFileChange,
  };
}
