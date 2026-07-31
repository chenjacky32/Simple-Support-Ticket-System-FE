import { http } from "@/lib/api";
import type { LoginInput, RegisterInput } from "@/schemas/auth";
import type { TicketInput } from "@/schemas/ticket";


export const httpService = {
  // --- Auth ---
  login: async (data: LoginInput) => {
    const response = await http.post("/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterInput) => {
    const response = await http.post("/auth/register", data);
    return response.data;
  },
  getMe: async () => {
    const response = await http.get("/users/profile");
    return response.data;
  },

  // --- Dashboard ---
  getDashboardStats: async (params?: Record<string, any>) => {
    const response = await http.get("/dashboard/stat", { params });
    return response.data;
  },

  // --- Tickets ---
  getTicketsList: async (params?: Record<string, any>) => {
    const response = await http.get("/tickets", { params });
    return response.data;
  },
  getTicketDetails: async (slug: string) => {
    const response = await http.get(`/tickets/${slug}`);
    return response.data;
  },
  createTicket: async (data: TicketInput) => {
    const response = await http.post("/tickets", data);
    return response.data;
  },
  replyTicket: async (slug: string, data: { message: string; attachments?: string[] }) => {
    const response = await http.post(`/tickets/${slug}/replies`, data);
    return response.data;
  },
  updateTicketStatus: async (slug: string, data: { status: string; reason?: string }) => {
    const response = await http.patch(`/tickets/${slug}/status`, data);
    return response.data;
  },

  // --- Users ---
  getUsers: async (params?: Record<string, any>) => {
    const response = await http.get("/users", { params });
    return response.data;
  },
  getUsersList: async (params?: Record<string, any>) => {
    const response = await http.get("/users/list", { params });
    return response.data;
  },
};
