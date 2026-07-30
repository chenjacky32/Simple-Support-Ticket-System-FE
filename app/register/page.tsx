'use client'

import * as React from "react"
import Link from "next/link"
import { User, Mail, Lock } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthSuccess } from "@/components/auth/auth-success"
import { AuthButton } from "@/components/auth/auth-button"
import { useRegister } from "@/hooks/use-register"

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    errors,
    mutation,
    onSubmit,
    errorMsg,
    success,
  } = useRegister();

  if (success) {
    return <AuthSuccess />;
  }

  return (
    <AuthLayout
      title="Create an Account"
      description="Submit an activation request to join SimpleTicket"
      errorMsg={errorMsg || (mutation.isError ? "Invalid credentials or account is inactive." : null)}
      errorTitle="Registration Failed"
      footerAction={
        <>
          Already have an account?{" "}
          <Link
            href="/"
            className="font-medium text-primary hover:underline transition-colors"
          >
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          id="name"
          label="Full Name"
          icon={User}
          type="text"
          placeholder="John Doe"
          register={register("name")}
          error={errors.name?.message}
          disabled={mutation.isPending}
        />

        <AuthInput
          id="email"
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="john@example.com"
          register={register("email")}
          error={errors.email?.message}
          disabled={mutation.isPending}
        />

        <AuthInput
          id="password"
          label="Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          register={register("password")}
          error={errors.password?.message}
          disabled={mutation.isPending}
        />

        <AuthInput
          id="confirmPassword"
          label="Confirm Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          disabled={mutation.isPending}
        />

        <AuthButton
          isLoading={mutation.isPending}
          loadingText="Registering..."
        >
          Submit Registration
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
