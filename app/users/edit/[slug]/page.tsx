"use client";

import DashboardLayout from "@/components/templates/dashboard";
import { useParams, useRouter } from "next/navigation";
import { useEditUser } from "@/hooks/use-edit-user";
import { Card } from "@/components/ui/card";
import { UserInput } from "@/components/users/edit/user-input";
import { UserEditBackLink } from "@/components/users/edit/user-edit-back-link";
import { UserEditSuccess } from "@/components/users/edit/user-edit-success";
import { UserEditLoading } from "@/components/users/edit/user-edit-loading";
import { UserEditHeader } from "@/components/users/edit/user-edit-header";
import { UserEditError } from "@/components/users/edit/user-edit-error";
import { UserEditActions } from "@/components/users/edit/user-edit-actions";

export default function EditUserManagementPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const userId = params?.slug || "";

  const {
    register,
    handleSubmit,
    errors,
    mutationError,
    mutationPending,
    onSubmit,
    success,
    errorMsg,
    isFetchingUser,
    control,
  } = useEditUser(userId);

  return (
    <DashboardLayout title="Edit User">
      <div className="space-y-6 mx-auto">
        {/* Back Link */}
        <UserEditBackLink userId={userId} />

        <Card className="bg-card border border-border rounded-xl p-6 shadow-xs">
          {success ? (
            /* Success Feedback */
            <UserEditSuccess />
          ) : isFetchingUser ? (
            <UserEditLoading />
          ) : (
            /* Edit Form */
            <div className="space-y-6">
              <UserEditHeader />

              {/* Error Alert */}
              <UserEditError errorMsg={errorMsg} mutationError={mutationError} />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <UserInput
                  id="name"
                  label="Name"
                  inputType="input"
                  placeholder="Enter full name"
                  register={register("name")}
                  error={errors.name?.message}
                  disabled={mutationPending}
                />

                <UserInput
                  id="email"
                  label="Email"
                  inputType="input"
                  type="email"
                  placeholder="Enter email address"
                  register={register("email")}
                  error={errors.email?.message}
                  disabled={mutationPending}
                />

                <UserInput
                  id="role"
                  label="Role"
                  inputType="select"
                  placeholder="Select a role"
                  control={control}
                  name="role"
                  options={[
                    { label: "USERS", value: "USERS" },
                    { label: "ADMIN", value: "ADMIN" },
                    { label: "SUPERADMIN", value: "SUPERADMIN" },
                  ]}
                  error={errors.role?.message}
                  disabled={mutationPending}
                />

                <UserInput
                  id="isActive"
                  label="Status"
                  inputType="select"
                  placeholder="Select status"
                  control={control}
                  name="isActive"
                  options={[
                    { label: "ACTIVE", value: "true" },
                    { label: "INACTIVE", value: "false" },
                  ]}
                  isBoolean
                  error={errors.isActive?.message}
                  disabled={mutationPending}
                />

                <UserEditActions
                  mutationPending={mutationPending}
                  onCancel={() => router.back()}
                />
              </form>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
