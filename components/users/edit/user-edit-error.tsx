import { AlertCircle } from "lucide-react";

interface UserEditErrorProps {
  errorMsg?: string | null;
  mutationError?: unknown;
}

export function UserEditError({ errorMsg, mutationError }: UserEditErrorProps) {
  if (!errorMsg && !mutationError) return null;

  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
    >
      <AlertCircle className="h-4 w-4" />
      <div className="font-medium">
        {errorMsg || "An error occured while editing user."}
      </div>
    </div>
  );
}
