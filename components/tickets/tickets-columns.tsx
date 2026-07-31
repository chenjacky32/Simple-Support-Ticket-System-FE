import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { createColumnHelper } from "@tanstack/react-table"
import { Ticket } from "@/types/tickets"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

const columnHelper = createColumnHelper<Ticket>();

export const TicketsColumns = (page: number = 1, size: number = 10) => [
  columnHelper.display({
    id: "no",
    header: "No.",
    cell: (info) => (
      <span className="font-medium text-muted-foreground">
        {(page - 1) * size + info.row.index + 1}
      </span>
    ),
  }),
  columnHelper.accessor("date", {
    header: "Date Created",
    cell: (info) => {
      try {
        return format(new Date(info.getValue()), "MMM dd, yyyy HH:mm");
      } catch {
        return info.getValue();
      }
    },
  }),
  columnHelper.accessor("ticketCode", {
    header: "Ticket ID",
    cell: (info) => <span className="font-mono font-semibold text-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => <span className="font-medium text-foreground line-clamp-1">{info.getValue()}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const val = info.getValue();
      if (!val) return <span className="text-muted-foreground">-</span>;

      const rawStatus = val.toUpperCase();
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";

      if (rawStatus === "OPENED") {
        variant = "default";
      } else if (rawStatus === "IN_PROGRESS" || rawStatus === "INPROGRESS") {
        variant = "secondary";
      } else if (rawStatus === "RESOLVED") {
        variant = "outline";
      }

      return (
        <Badge variant={variant} className="capitalize">
          {val.toLowerCase().replace('_', ' ')}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("resolvedAt", {
    header: "Resolved At",
    cell: (info) => {
      const val = info.getValue();
      if (!val) return <span className="text-muted-foreground">-</span>;
      try {
        return format(new Date(val), "MMM dd, yyyy");
      } catch {
        return val;
      }
    },
  }),
  columnHelper.accessor("createdBy.name", {
    header: "Submitted By",
    cell: (info) => <span className="underline underline-offset-2">
      {info.getValue()}
    </span>

  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (props) => (
      <Link href={`/tickets/${props.row.original.id}`}>
        <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs">
          <Eye className="size-3.5" />
          Details
        </Button>
      </Link>
    ),
  }),
];
