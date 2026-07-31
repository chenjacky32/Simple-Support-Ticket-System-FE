import { UserProfile } from "./auth";

export type TicketStatus = "Opened" | "Inprogress" | "Resolved" | "OPENED" | "IN_PROGRESS" | "RESOLVED";

export interface TicketCreatedBy {
  name: string;
  email: string;
  role: string;
}

export interface Ticket {
  id: string;
  date: string;
  ticketCode: string;
  title: string;
  description: string;
  attachmentPath: string | null;
  status: TicketStatus;
  resolvedAt: string | null;
  createdBy: TicketCreatedBy;
}

export interface TicketReply {
  id: string;
  ticketId: string;
  message: string;
  createdAt: string;
  createdBy: TicketCreatedBy;
}

export interface TicketDetail extends Ticket {
  replies: TicketReply[];
}

export interface ResponseMeta {
  page: number;
  size: number;
  totalRecord: number;
  totalPage: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface TicketsListResponse {
  status: string;
  message: string;
  meta: ResponseMeta;
  data: Ticket[];
}

export interface DashboardStats {
  startDate: string;
  endDate: string;
  totalTickets: number;
  openedTickets: number;
  inprogressTickets: number;
  resolvedTickets: number;
  statusCompositions: {
    status: string;
    percentage: number;
    count: number;
  }[];
}
