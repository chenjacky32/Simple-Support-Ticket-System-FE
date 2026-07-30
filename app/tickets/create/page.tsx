'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2, ArrowLeft, Send, Paperclip, CheckCircle2, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"
import { ticketSchema, TicketInput } from "@/schemas/ticket"
import DashboardLayout from "@/components/templates/dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import Link from "next/link"

export default function CreateTicketPage() {
  const router = useRouter();
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      attachmentPath: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TicketInput) => {
      const response = await api.post("/tickets", data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        setSuccess(true);
        reset();
        setFileName(null);
        setTimeout(() => {
          router.push("/tickets");
        }, 1500);
      } else {
        setErrorMsg(data.message || "Failed to create ticket.");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to submit ticket. Please check fields.";
      setErrorMsg(message);
    },
  });

  const onSubmit = (data: TicketInput) => {
    setErrorMsg(null);
    mutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Simulate file upload setting an attachment path string
      setValue("attachmentPath", `attachments/${Date.now()}_${file.name}`);
    }
  };

  return (
    <DashboardLayout title="Create Ticket">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Back Link */}
        <div className="flex items-center">
          <Link
            href="/tickets"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Tickets
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-xs">
          {success ? (
            /* Success Feedback */
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Ticket Created Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                Your ticket has been recorded. Redirecting you to the ticket vault...
              </p>
              <div className="pt-2">
                <Loader2 className="size-5 animate-spin mx-auto text-muted-foreground" />
              </div>
            </div>
          ) : (
            /* Create Form */
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Submit Support Complaint</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Describe your problem in detail and attach optional troubleshooting media.
                </p>
              </div>

              {/* Error Alert */}
              {(errorMsg || mutation.isError) && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  <p className="font-medium">{errorMsg || "An error occurred while creating ticket."}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Title */}
                <Field>
                  <FieldLabel htmlFor="title">Ticket Title</FieldLabel>
                  <Input
                    {...register("title")}
                    id="title"
                    placeholder="Cannot login: Invalid JWT token signature"
                    disabled={mutation.isPending}
                  />
                  {errors.title && <FieldError>{errors.title.message}</FieldError>}
                </Field>

                {/* Description */}
                <Field>
                  <FieldLabel htmlFor="description">Detailed Description</FieldLabel>
                  <Textarea
                    {...register("description")}
                    id="description"
                    placeholder="Please specify step-by-step instructions to reproduce the issue. Include browser info, status codes, and error codes."
                    className="min-h-[140px]"
                    disabled={mutation.isPending}
                  />
                  {errors.description && <FieldError>{errors.description.message}</FieldError>}
                </Field>

                {/* Attachment Upload area */}
                <Field>
                  <FieldLabel htmlFor="attachment">Supporting Attachment (Optional)</FieldLabel>
                  <div className="relative border border-dashed border-border hover:border-muted-foreground/50 rounded-lg p-4 bg-muted/20 text-center transition-colors">
                    <input
                      type="file"
                      id="attachment"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 size-full opacity-0 cursor-pointer"
                      disabled={mutation.isPending}
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Paperclip className="size-5 text-muted-foreground" />
                      {fileName ? (
                        <p className="text-sm font-semibold text-foreground truncate max-w-xs">{fileName}</p>
                      ) : (
                        <div>
                          <p className="text-sm font-medium">Click to select files or drag-and-drop</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Supports images & videos (max. 10MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <input type="hidden" {...register("attachmentPath")} />
                </Field>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Link href="/tickets">
                    <Button variant="outline" type="button" disabled={mutation.isPending}>
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={mutation.isPending} className="gap-2">
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
