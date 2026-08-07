import { z } from "zod";

export const ticketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title must not exceed 255 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  attachmentPath: z.string().optional().nullable(),
});

export const replySchema = z.object({
  message: z.string().min(1, "Reply message cannot be empty"),
});

export type TicketInput = z.infer<typeof ticketSchema>;
export type ReplyInput = z.infer<typeof replySchema>;