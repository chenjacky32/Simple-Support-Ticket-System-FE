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
  }
}
