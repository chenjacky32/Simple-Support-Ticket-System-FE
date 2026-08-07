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
      if (!val) return <div className="text-muted-foreground">-</div>;

      const rawStatus = val.toUpperCase();
      let badgeColor = "bg-muted text-muted-foreground border-border";

      if (rawStatus === "OPENED") {
        badgeColor = "bg-badge-1/10 text-badge-1 border-badge-1/20";
      } else if (rawStatus === "IN_PROGRESS" || rawStatus === "INPROGRESS") {
        badgeColor = "bg-badge-2/10 text-badge-2 border-badge-2/20";
      } else if (rawStatus === "RESOLVED") {
        badgeColor = "bg-badge-3/10 text-badge-3 border-badge-3/20";
      }

      return (
        <Badge className={`capitalize ${badgeColor} cursor-pointer`}>
          {val.toUpperCase().replace('_', ' ')}
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
