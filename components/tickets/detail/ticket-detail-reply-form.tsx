import { AlertCircle, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldError } from "@/components/ui/field"
import React from "react"

interface TicketDetailReplyFormProps {
  userRole?: string;
  errorMsg: string | null;
  register: any;
  errors: any;
  replyMutation: any;
  onSubmitReply: any;
  handleSubmit: any;
}

export function TicketDetailReplyForm({
  userRole,
  errorMsg,
  register,
  errors,
  replyMutation,
  onSubmitReply,
  handleSubmit,
}: TicketDetailReplyFormProps) {
  if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
    return null;
  }

  return (
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
  )
}
