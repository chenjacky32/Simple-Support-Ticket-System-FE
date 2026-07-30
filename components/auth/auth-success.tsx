import * as React from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthContainer } from "./auth-container"

export function AuthSuccess() {
  return (
    <AuthContainer>
      <div className="text-center space-y-6">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
          <CheckCircle className="size-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Registration Successful!
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your account has been successfully created. In accordance with security policies,
          your account is initially **inactive** and must be reviewed and activated by a
          **Super Admin** before you can log in.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button className="w-full justify-center">Return to Login</Button>
          </Link>
        </div>
      </div>
    </AuthContainer>
  )
}
