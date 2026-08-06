import * as React from "react"
import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { UserProfile } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const columnHelper = createColumnHelper<UserProfile>();

export const UsersColumns = (page: number = 1, size: number = 10) => [
  columnHelper.display({
    id: "No.",
    header: "No.",
    cell: (info) => (
      <span className="font-medium text-muted-foreground">
        {(page - 1) * size + info.row.index + 1}
      </span>
    ),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="font-semibold text-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("email", {
    header: "Email Address",
    cell: (info) => (
      <span className="text-foreground line-clamp-1">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("role", {
    header: "System Role",
    cell: (info) => {
      const role = info.getValue()?.toUpperCase() || "";
      let roleColor = "bg-muted text-muted-foreground";

      if (role === "SUPERADMIN" || role === "SUPER ADMIN") {
        roleColor = "bg-destructive/10 text-destructive border border-destructive/20";
      } else if (role === "ADMIN") {
        roleColor = "bg-badge-2/10 text-badge-2 border border-badge-2/20";
      } else if (role === "USERS" || role === "USER") {
        roleColor = "bg-primary/10 text-primary border border-primary/20";
      }

      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${roleColor}`}>
          {role.replace("_", " ")}
        </span>
      );
    },
  }),
  columnHelper.accessor("isActive", {
    header: "Account Status",
    cell: (info) => {
      const active = info.getValue();
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${active
          ? "bg-badge-3/10 text-badge-3 border-badge-3/20"
          : "bg-badge-2/10 text-badge-2 border-badge-2/20"
          }`}>
          {active ? "Active" : "Inactive"}
        </span>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Action",
    cell: (props) => (
      <Link href={`/users/${props.row.original.id}`}>
        <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs">
          <Eye className="size-3.5" />
          Details
        </Button>
      </Link>
    ),
  }),
];
