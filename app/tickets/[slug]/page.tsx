'use client'

import * as React from "react"
import DashboardLayout from "@/components/templates/dashboard"
import { useAuth } from "@/hooks/use-auth"
import { useTicketDetail } from "@/hooks/use-ticket-detail"
import { TicketDetailLoading } from "@/components/tickets/detail/ticket-detail-loading"
import { TicketDetailError } from "@/components/tickets/detail/ticket-detail-error"
import { TicketDetailBackLink } from "@/components/tickets/detail/ticket-detail-back-link"
import { TicketDetailHeader } from "@/components/tickets/detail/ticket-detail-header"
import { TicketDetailDescription } from "@/components/tickets/detail/ticket-detail-description"
import { TicketDetailTimeline } from "@/components/tickets/detail/ticket-detail-timeline"
import { TicketDetailReplyForm } from "@/components/tickets/detail/ticket-detail-reply-form"
import { Card } from "@/components/ui/card"
import { ticketHelper } from "@/lib/helper"


export default function TicketDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: ticketId } = React.use(params);
  const { user } = useAuth();

  const {
    ticket,
    isLoading,
    error,
    errorMsg,
    register,
    handleSubmit,
    errors,
    replyMutation,
    statusMutation,
    onSubmitReply,
    handleStatusChange,
  } = useTicketDetail(ticketId, user);

  if (isLoading) return <TicketDetailLoading />;
  if (error || !ticket) return <TicketDetailError />;

  const isAdminOrSuper = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  const rawStatus = ticket.status?.toUpperCase() || "";
  const badgeColor = ticketHelper.getBadgeStatusColor(rawStatus);

  return (
    <DashboardLayout title={`Ticket - ${ticket.ticketCode}`}>
      <div className="space-y-6 mx-auto">
        {/* Back Link */}
        <TicketDetailBackLink />

        {/* Master Ticket Summary */}
        <Card className="bg-card border border-border rounded-xl p-6 shadow-xs">
          <TicketDetailHeader
            ticket={ticket}
            badgeColor={badgeColor}
            isAdminOrSuper={isAdminOrSuper}
            rawStatus={rawStatus}
            statusMutation={statusMutation}
            handleStatusChange={handleStatusChange}
          />

          {/* Description & File details */}
          <TicketDetailDescription ticket={ticket} />
        </Card>

        {/* Responses/Timeline section */}
        <TicketDetailTimeline ticket={ticket} />

        {/* Reply Submission Form */}
        <TicketDetailReplyForm
          userRole={user?.role}
          errorMsg={errorMsg}
          register={register}
          errors={errors}
          replyMutation={replyMutation}
          onSubmitReply={onSubmitReply}
          handleSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout >
  );
}