import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { loginSchema, type LoginInput } from "@/schemas/auth"
import { useAuth } from "@/app/providers"
import { httpService } from "@/lib/services"

export function useLogin() {
  const router = useRouter();
  const { login, isLoading: authLoading, user } = useAuth();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      return await httpService.login(data);
    },
    onSuccess: (data) => {
      if (data.status === "success" && data.data?.accessToken) {
        login(data.data.accessToken);
      } else {
        setErrorMsg(data.message || "Failed to log in.");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Invalid credentials or account inactive.";
      setErrorMsg(message);
    },
  });

  const onSubmit = (data: LoginInput) => {
    setErrorMsg(null);
    mutation.mutate(data);
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  return {
    register,
    handleSubmit,
    errors,
    mutation,
    onSubmit,
    errorMsg,
    authLoading,
  };
}
