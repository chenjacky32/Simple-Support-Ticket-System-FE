import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { registerSchema, type RegisterInput } from "@/schemas/auth"
import { httpService } from "@/lib/services"

export function useRegister() {
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      return await httpService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        setSuccess(true);
      } else {
        setErrorMsg(data.message || "Registration failed.");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Email already exists or invalid registration details.";
      setErrorMsg(message);
    },
  });

  const onSubmit = (data: RegisterInput) => {
    setErrorMsg(null);
    mutation.mutate(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    mutation,
    onSubmit,
    errorMsg,
    success,
  };
}
