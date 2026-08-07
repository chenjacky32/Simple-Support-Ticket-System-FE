import { http } from "@/lib/api";
import type { LoginInput, RegisterInput } from "@/schemas/auth";
import type { TicketInput } from "@/schemas/ticket";
import { UserEditInput } from "@/schemas/user";
import { AuthResponse, UserProfileResponse } from "@/types/auth";
import { DashboardStatsResponse } from "@/types/dashboard";
import { TicketDetailResponse, TicketsListResponse } from "@/types/tickets";
import { UserDetailResponse } from "@/types/users";

export const httpService = {
  // --- Auth ---
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await http.post("/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterInput) => {
    const response = await http.post("/auth/register", data);
    return response.data;
  },
  getMe: async (): Promise<UserProfileResponse> => {
    const response = await http.get("/users/profile");
    return response.data;
  },

  // --- Dashboard ---
  getDashboardStats: async (
    params?: Record<string, any>,
  ): Promise<DashboardStatsResponse> => {
    const response = await http.get("/dashboard/stat", { params });
    return response.data;
  },

  // --- Tickets ---
  getTicketsList: async (
    params?: Record<string, any>,
  ): Promise<TicketsListResponse> => {
    const response = await http.get("/tickets", { params });
    return response.data;
  },
  getTicketDetails: async (slug: string): Promise<TicketDetailResponse> => {
    const response = await http.get(`/tickets/${slug}`);
    return response.data;
  },
  createTicket: async (data: TicketInput) => {
    const response = await http.post("/tickets", data);
    return response.data;
  },
  replyTicket: async (
    slug: string,
    data: { message: string; attachments?: string[] },
  ) => {
    const response = await http.post(`/tickets/${slug}/replies`, data);
    return response.data;
  },
  updateTicketStatus: async (slug: string, data: { status: string }) => {
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
  getUserDetails: async (slug: string): Promise<UserDetailResponse> => {
    const response = await http.get(`/users/${slug}`);
    return response.data;
  },
  updateUsers: async (slug: string, data: UserEditInput) => {
    const response = await http.put(`/users/${slug}`, data);
    return response.data;
  },
};
