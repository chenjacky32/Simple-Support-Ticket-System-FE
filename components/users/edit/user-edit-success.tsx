import { CheckCircle2 } from "lucide-react";

export function UserEditSuccess() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
      <div className="h-12 w-12 rounded-full bg-(--badge-3)/20 flex items-center justify-center">
        <CheckCircle2 className="h-6 w-6 text-badge-3" />
      </div>
      <h3 className="text-xl font-semibold">User Updated Successfully</h3>
      <p className="text-muted-foreground max-w-sm">
        The user has been successfully updated. Redirecting back to user details...
      </p>
    </div>
  );
}
