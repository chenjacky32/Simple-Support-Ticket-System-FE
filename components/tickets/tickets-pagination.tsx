import * as React from "react"
import { Button } from "@/components/ui/button"
import { type ResponseMeta } from "@/types/tickets"

interface TicketsPaginationProps {
  meta?: ResponseMeta;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export function TicketsPagination({ meta, page, setPage }: TicketsPaginationProps) {
  if (!meta || meta.totalPage <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/20">
      <span className="text-xs text-muted-foreground">
        Showing page <strong>{meta.page}</strong> of <strong>{meta.totalPage}</strong> ({meta.totalRecord} records)
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={!meta.hasPrev}
        >
          Previous
        </Button>

        {/* Generate numbers */}
        {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((pageNum) => (
          <Button
            key={pageNum}
            size="sm"
            variant={page === pageNum ? "default" : "outline"}
            onClick={() => setPage(pageNum)}
            className="w-8 h-8 p-0"
          >
            {pageNum}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.min(p + 1, meta.totalPage))}
          disabled={!meta.hasNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
