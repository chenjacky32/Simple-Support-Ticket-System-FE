'use client'

import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Loader2, AlertCircle, Paperclip, Send, Clock, User, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api"
import { TicketDetail, TicketStatus } from "@/types/tickets"
import { useAuth } from "@/app/providers"
import DashboardLayout from "@/components/templates/dashboard"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

// Validation schema for reply
const replySchema = z.object({
  message: z.string().min(1, "Reply message cannot be empty"),
});
type ReplyInput = z.infer<typeof replySchema>;

export default function TicketDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: ticketId } = React.use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Fetch Ticket details & replies
  const { data: ticket, isLoading, error } = useQuery<TicketDetail>({
    queryKey: ["ticketDetail", ticketId],
    queryFn: async () => {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data.data;
    },
    enabled: !!ticketId,
  });

  // Reply Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyInput>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      message: "",
    },
  });

  // Mutation to Post a reply
  const replyMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post(`/tickets/${ticketId}/replies`, { message });
      return response.data;
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["ticketDetail", ticketId] });
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || "Failed to post reply.");
    },
  });

  // Mutation to Update status (Admin/Superadmin)
  const statusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const response = await api.patch(`/tickets/${ticketId}/status`, { status: newStatus });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketDetail", ticketId] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to update ticket status.");
    },
  });

  const onSubmitReply = (data: ReplyInput) => {
    setErrorMsg(null);
    replyMutation.mutate(data.message);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      statusMutation.mutate(selected);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Ticket Details">
        <div className="flex h-64 items-center justify-center bg-card border border-border rounded-xl">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !ticket) {
    return (
      <DashboardLayout title="Ticket Details">
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive max-w-xl mx-auto">
          <AlertCircle className="size-5 shrink-0" />
          <div>
            <h4 className="font-semibold">Failed to find ticket</h4>
            <p className="text-xs text-destructive/80">The requested ticket does not exist or you lack permission to view it.</p>
            <Link href="/tickets" className="inline-block mt-3 font-semibold hover:underline">
              Return to tickets vault
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isAdminOrSuper = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  // Status Badge styling helper
  const rawStatus = ticket.status?.toUpperCase() || "";
  let badgeColor = "bg-muted text-muted-foreground border-border";
  if (rawStatus === "OPENED" || rawStatus === "OPEN") {
    badgeColor = "bg-primary/10 text-primary border-primary/20";
  } else if (rawStatus === "IN_PROGRESS" || rawStatus === "INPROGRESS" || rawStatus === "PROG") {
    badgeColor = "bg-amber-500/10 text-amber-700 border-amber-500/20";
  } else if (rawStatus === "RESOLVED" || rawStatus === "RSLV") {
    badgeColor = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
  }

  return (
    <DashboardLayout title={`Ticket - ${ticket.ticketCode}`}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="flex items-center">
          <Link
            href="/tickets"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Tickets Vault
          </Link>
        </div>

        {/* Master Ticket Summary */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">{ticket.ticketCode}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${badgeColor}`}>
                  {ticket.status.toLowerCase()}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{ticket.title}</h2>
              <p className="text-xs text-muted-foreground">
                Submitted on {format(new Date(ticket.date), "PPP p")} by <span className="font-semibold text-foreground">{ticket.createdBy.name} ({ticket.createdBy.email})</span>
              </p>
            </div>

            {/* Admin status controller */}
            {isAdminOrSuper && (
              <div className="flex flex-col gap-1.5 shrink-0 bg-muted/30 border border-border p-3 rounded-lg">
                <label className="text-xs font-bold text-muted-foreground uppercase" htmlFor="change-status">Change Status</label>
                <div className="flex items-center gap-2">
                  <select
                    id="change-status"
                    value={rawStatus === "OPEN" ? "Opened" : rawStatus === "IN_PROGRESS" || rawStatus === "INPROGRESS" ? "Inprogress" : "Resolved"}
                    onChange={handleStatusChange}
                    disabled={statusMutation.isPending}
                    className="h-8 rounded-md border border-input bg-card px-2.5 text-xs text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="Opened">Opened</option>
                    <option value="Inprogress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  {statusMutation.isPending && <Loader2 className="size-4 animate-spin text-primary" />}
                </div>
              </div>
            )}
          </div>

          {/* Description & File details */}
          <div className="space-y-4">
            <div className="text-sm text-foreground whitespace-pre-line leading-relaxed bg-muted/10 border border-border/50 rounded-lg p-4">
              {ticket.description}
            </div>

            {ticket.attachmentPath && (
              <div className="flex items-center gap-2 text-xs border border-border bg-muted/40 p-2.5 rounded-lg w-fit">
                <Paperclip className="size-4 text-muted-foreground" />
                <span className="font-medium text-muted-foreground">Attachment:</span>
                <a
                  href={`#`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading simulated attachment path: ${ticket.attachmentPath}`);
                  }}
                  className="font-bold text-primary hover:underline"
                >
                  {ticket.attachmentPath.split("/").pop()}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Responses/Timeline section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Responses Timeline</h3>

          <div className="space-y-4">
            {ticket.replies && ticket.replies.length > 0 ? (
              ticket.replies.map((reply) => {
                const isSupport = reply.createdBy.role === "ADMIN" || reply.createdBy.role === "SUPERADMIN" || reply.createdBy.role === "SUPER ADMIN";
                return (
                  <div
                    key={reply.id}
                    className={`flex gap-3 max-w-[85%] ${isSupport ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                  >
                    {/* User Icon indicator */}
                    <div className={`size-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                      isSupport ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground border border-border"
                    }`}>
                      {isSupport ? "SUP" : reply.createdBy.name.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Chat Bubble container */}
                    <div className={`rounded-xl border p-4 shadow-xs space-y-1.5 ${
                      isSupport
                        ? "bg-card border-border text-foreground"
                        : "bg-primary text-primary-foreground border-transparent"
                    }`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold">{reply.createdBy.name}</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${
                          isSupport
                            ? "bg-primary/10 text-primary"
                            : "bg-primary-foreground/20 text-primary-foreground"
                        }`}>
                          {isSupport ? "Support Staff" : "Client"}
                        </span>
                        <span className={`text-[9px] ${isSupport ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
                          {format(new Date(reply.createdAt), "MMM dd, p")}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{reply.message}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground bg-card border border-border rounded-xl">
                No replies have been recorded yet. Submitting a reply will notify relevant parties.
              </div>
            )}
          </div>
        </div>

        {/* Reply Submission Form */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Post Response</h3>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive mb-4">
              <AlertCircle className="size-4 shrink-0" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmitReply)} className="space-y-4">
            <Field>
              <Textarea
                {...register("message")}
                placeholder="Write your update details or resolution progress..."
                className="min-h-[100px]"
                disabled={replyMutation.isPending}
              />
              {errors.message && <FieldError>{errors.message.message}</FieldError>}
            </Field>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={replyMutation.isPending} className="gap-2">
                {replyMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Submit Response
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}