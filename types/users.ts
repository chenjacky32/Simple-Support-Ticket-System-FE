import { UserRole } from "@/types/auth";

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UserDetailResponse {
  status: "success" | "fail";
  message: string;
  data: UserDetail;
}
