"use client";

import { TicketCreateActions } from "@/components/tickets/create/ticket-create-actions";
import { TicketCreateBackLink } from "@/components/tickets/create/ticket-create-back-link";
import { TicketCreateErrorAlert } from "@/components/tickets/create/ticket-create-error-alert";
import { TicketCreateFormHeader } from "@/components/tickets/create/ticket-create-form-header";
import { TicketCreateSuccess } from "@/components/tickets/create/ticket-create-success";
import { TicketInput } from "@/components/tickets/create/ticket-input";
import DashboardLayout from "@/components/templates/dashboard";
import { Card } from "@/components/ui/card";
import { useCreateTickets } from "@/hooks/use-create-tickets";

export default function CreateTicketPage() {
  const {
    register,
    handleSubmit,
    errors,
    mutationError,
    mutationPending,
    onSubmit,
    success,
    errorMsg,
    fileName,
    handleFileChange,
  } = useCreateTickets();

  return (
    <DashboardLayout title="Create Ticket">
      <div className="space-y-6 mx-auto">
        {/* Back Link */}
        <TicketCreateBackLink />

        <Card className="bg-card border border-border rounded-xl p-6 shadow-xs">
          {success ? (
            /* Success Feedback */
            <TicketCreateSuccess />
          ) : (
            /* Create Form */
            <div className="space-y-6">
              <TicketCreateFormHeader />

              {/* Error Alert */}
              {(errorMsg || mutationError) && (
                <TicketCreateErrorAlert
                  message={
                    errorMsg || "An error occurred while creating ticket."
                  }
                />
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <TicketInput
                  id="title"
                  label="Ticket Title"
                  inputType="input"
                  register={register("title")}
                  placeholder="Cannot login: Invalid JWT token signature"
                  error={errors.title?.message}
                  disabled={mutationPending}
                />

                <TicketInput
                  id="description"
                  label="Detailed Description"
                  inputType="textarea"
                  register={register("description")}
                  placeholder="Please specify step-by-step instructions to reproduce the issue. Include browser info, status codes, and error codes."
                  className="min-h-[140px]"
                  error={errors.description?.message}
                  disabled={mutationPending}
                />

                <TicketInput
                  id="attachment"
                  label="Supporting Attachment (Optional)"
                  inputType="file"
                  register={register("attachmentPath")}
                  fileName={fileName}
                  disabled={mutationPending}
                  onFileChange={handleFileChange}
                />

                {/* Actions */}
                <TicketCreateActions isPending={mutationPending} />
              </form>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
