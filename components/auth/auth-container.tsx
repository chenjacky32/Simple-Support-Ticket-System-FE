import * as React from "react"
import { Card } from "@/components/ui/card"

export function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-foreground transition-colors duration-200">
      <Card className="w-full max-w-md space-y-8 p-8 shadow-sm">
        {children}
      </Card>
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SimpleTicket. Internal Utility.
      </footer>
    </div>
  )
}
