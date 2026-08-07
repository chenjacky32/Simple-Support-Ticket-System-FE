import * as React from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface AuthButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
}

export function AuthButton({
  isLoading,
  loadingText,
  children,
  type = "submit",
  ...props
}: AuthButtonProps) {
  return (
    <Button
      type={type}
      className="w-full justify-center h-10 gap-2 mt-2"
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
