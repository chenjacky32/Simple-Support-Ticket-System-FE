import { UserDetail } from "@/types/users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import Link from "next/link"

interface UserDetailInfoProps {
  user: UserDetail;
}

export function UserDetailInfo({ user }: UserDetailInfoProps) {
  const getBadgeColor = (isActive: boolean) => {
    switch (isActive) {
      case true:
        return "bg-[var(--badge-3)] text-white hover:bg-[var(--badge-3)]/90"
      case false:
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const badgeColor = getBadgeColor(user.isActive);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={badgeColor}>
            {user.isActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
          <Link href={`/users/edit/${user.id}`}>
            <Button variant="outline" size="default">
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
            <p className="text-base text-foreground mt-1 font-mono">{user.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
            <p className="text-base text-foreground mt-1 capitalize">{user.role}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
            <p className="text-base text-foreground mt-1">
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Updated At</h3>
            <p className="text-base text-foreground mt-1">
              {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
