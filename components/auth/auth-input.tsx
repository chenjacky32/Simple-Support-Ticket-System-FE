import * as React from "react"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { LucideIcon } from "lucide-react"
import { UseFormRegisterReturn } from "react-hook-form"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  icon: LucideIcon
  error?: string
  register: UseFormRegisterReturn
  rightAction?: React.ReactNode
}

export function AuthInput({
  id,
  label,
  icon: Icon,
  error,
  register,
  rightAction,
  ...props
}: AuthInputProps) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {rightAction && <div>{rightAction}</div>}
      </div>
      <div className="relative">
        <Icon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input id={id} className="pl-10" {...register} {...props} />
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
