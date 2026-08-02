import { Ticket } from "@/types/tickets"

export const ticketHelper = {
  // 1. Pure Function: Change tickets array to csv format string
  ticketsToCSV: (tickets: Ticket[]): string => {
    const headers = ["Ticket ID", "Title", "Status", "Date Created", "Resolved At", "Created By"];
    const csvRows = [
      headers.join(","),
      ...tickets.map((t) =>
        [
          t.ticketCode,
          `"${t.title.replace(/"/g, '""')}"`,
          t.status,
          t.date,
          t.resolvedAt || "-",
          t.createdBy.name,
        ].join(",")
      ),
    ];
    return csvRows.join("\n");
  },

  // 2. Pure Function: Change tickets array to json format string
  ticketsToJSON: (tickets: Ticket[]): string => {
    return JSON.stringify(tickets, null, 2);
  },

  // 3. Side-Effect Function: Trigger download in browser
  triggerDownload: (dataUri: string, filename: string): void => {
    if (typeof window === "undefined") return;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataUri);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  // 4. Main Function: export tickets to csv or json format
  exportTickets: (tickets: Ticket[], formatType: "csv" | "json") => {
    if (!tickets.length) return;

    if (formatType === "json") {
      const jsonContent = ticketHelper.ticketsToJSON(tickets);
      const dataUri = `data:text/json;charset=utf-8,${encodeURIComponent(jsonContent)}`;
      ticketHelper.triggerDownload(dataUri, `tickets_export_${Date.now()}.json`);
    } else {
      const csvContent = ticketHelper.ticketsToCSV(tickets);
      const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
      ticketHelper.triggerDownload(dataUri, `tickets_export_${Date.now()}.csv`);
    }
  },

  // 5. Badge Styling : Styling for Ticket Status
  getBadgeStatusColor: (status: string) => {
    switch (status) {
      case "OPENED":
        return "bg-badge-1/10 text-badge-1 border-badge-1/20";
      case "INPROGRESS":
        return "bg-badge-2/10 text-badge-2 border-badge-2/20";
      case "RESOLVED":
        return "bg-badge-3/10 text-badge-3 border-badge-3/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  },
}
