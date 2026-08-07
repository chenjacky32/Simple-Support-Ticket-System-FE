import { z } from "zod";

export const userEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  role: z.enum(["USERS", "ADMIN", "SUPERADMIN"], {
    required_error: "Role is required",
  }),
  isActive: z.boolean({
    required_error: "Status is required",
  }),
});

export type UserEditInput = z.infer<typeof userEditSchema>;
