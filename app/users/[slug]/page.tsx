"use client"

import * as React from "react"
import DashboardLayout from "@/components/templates/dashboard"
import { useUserDetail } from "@/hooks/use-user-detail"
import { UserDetailLoading } from "@/components/users/detail/user-detail-loading"
import { UserDetailError } from "@/components/users/detail/user-detail-error"
import { UserDetailBackLink } from "@/components/users/detail/user-detail-back-link"
import { UserDetailInfo } from "@/components/users/detail/user-detail-info"
import { Card } from "@/components/ui/card"

export default function UserDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: userId } = React.use(params);

  const {
    user,
    isLoading,
    error,
  } = useUserDetail(userId);

  if (isLoading) return <UserDetailLoading />;
  if (error || !user) return <UserDetailError />;

  return (
    <DashboardLayout title={`User - ${user.name}`}>
      <div className="space-y-6 mx-auto">
        <UserDetailBackLink />

        <Card className="bg-card border border-border rounded-xl p-6 shadow-xs">
          <UserDetailInfo user={user} />
        </Card>
      </div>
    </DashboardLayout>
  );
}