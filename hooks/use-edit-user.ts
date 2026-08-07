import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { httpService } from "@/lib/services";
import { userEditSchema, UserEditInput } from "@/schemas/user";
import { AxiosError } from "axios";
import { UserRole } from "@/types/auth";

export function useEditUser(userId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const { data: user, isLoading: isFetchingUser } = useQuery({
    queryKey: ["userDetail", userId],
    queryFn: async () => {
      const response = await httpService.getUserDetails(userId);
      return response.data;
    },
    enabled: !!userId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UserEditInput>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "USERS",
      isActive: true,
    },
  });


  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        isActive: user.isActive,
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: async (data: UserEditInput) => {
      return await httpService.updateUsers(userId, data);
    },
    onSuccess: (data) => {
      if (data.status === "success" || data.status === "Success") {
        setSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["userDetail", userId] });
        setTimeout(() => {
          router.push(`/users/`);
        }, 1500);
      } else {
        setErrorMsg(data.message || "Failed to update user.");
      }
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        setErrorMsg(
          error.response?.data?.message || "An error occurred while updating the user."
        );
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    },
  });

  const onSubmit = (data: UserEditInput) => {
    setErrorMsg(null);
    mutation.mutate(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    mutationError: mutation.error,
    mutationPending: mutation.isPending,
    onSubmit,
    success,
    errorMsg,
    isFetchingUser,
    control,
  };
}
