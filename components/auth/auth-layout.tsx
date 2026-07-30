import * as React from "react"
import { AuthContainer } from "./auth-container"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AuthLayoutProps {
  title: string
  description: string
  errorMsg?: string | null
  errorTitle?: string
  children: React.ReactNode
  footerAction?: React.ReactNode
}

export function AuthLayout({
  title,
  description,
  errorMsg,
  errorTitle = "Error",
  children,
  footerAction,
}: AuthLayoutProps) {
  return (
    <AuthContainer>
      <CardHeader className="text-center px-0 pt-0">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl mb-4">
          ST
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription className="mt-2 text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      {errorMsg && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertCircle className="size-4 shrink-0" />
            <AlertTitle>{errorTitle}</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        </div>
      )}

      <CardContent className="px-0 pb-0">
        {children}
      </CardContent>

      {footerAction && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {footerAction}
        </div>
      )}
    </AuthContainer>
  )
}
