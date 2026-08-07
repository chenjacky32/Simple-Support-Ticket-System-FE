'use client'

import * as React from "react"
import Link from "next/link"
import { Mail, Lock, Loader2 } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthButton } from "@/components/auth/auth-button"
import { useLogin } from "@/hooks/use-login"

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    errors,
    mutation,
    onSubmit,
    errorMsg,
    authLoading,
  } = useLogin();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthLayout
      title="Welcome to SimpleTicket"
      description="Sign in to continue to your ticketing dashboard"
      errorMsg={errorMsg || (mutation.isError ? "Invalid credentials or account is inactive." : null)}
      errorTitle="Login Failed"
      footerAction={
        <>
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline transition-colors"
          >
            Request Access
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthInput
          id="email"
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="admin@simpleticket.id"
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

        <AuthButton
          isLoading={mutation.isPending}
          loadingText="Signing in..."
        >
          Sign In
        </AuthButton>
      </form>
    </AuthLayout>
  );
}