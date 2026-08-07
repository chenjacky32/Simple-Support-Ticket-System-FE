import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface UserEditActionsProps {
  mutationPending: boolean;
  onCancel: () => void;
}

export function UserEditActions({ mutationPending, onCancel }: UserEditActionsProps) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={mutationPending}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={mutationPending}>
        {mutationPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  );
}
