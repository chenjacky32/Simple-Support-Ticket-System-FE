export type UserRole = "USERS" | "ADMIN" | "SUPERADMIN";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthResponse {
  status: "success" | "fail";
  message: string;
  data?: {
    accessToken: string;
  };
  errors?: Record<string, string[]>;
}
