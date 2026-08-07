import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function UserDetailBackLink() {
  return (
    <div>
      <Link
        href="/users"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Users
      </Link>
    </div>
  )
}
