import * as React from "react";
import { Paperclip } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

interface TicketInputProps {
  id: string;
  label: string;
  inputType: "input" | "textarea" | "file";
  register: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  className?: string;
  fileName?: string | null;
  disabled?: boolean;
  onFileChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function TicketInput({
  id,
  label,
  inputType,
  register,
  error,
  placeholder,
  className,
  fileName,
  disabled,
  onFileChange,
}: TicketInputProps) {
  if (inputType === "textarea") {
    return (
      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Textarea
          id={id}
          placeholder={placeholder}
          className={className}
          {...register}
          disabled={disabled}
        />
        {error && <FieldError>{error}</FieldError>}
      </Field>
    );
  }

  if (inputType === "file") {
    return (
      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <div className="relative border border-dashed border-border hover:border-muted-foreground/50 rounded-lg p-4 bg-muted/20 text-center transition-colors">
          <input
            type="file"
            id={id}
            accept="image/*,video/*"
            onChange={onFileChange}
            className="absolute inset-0 size-full opacity-0 cursor-pointer"
            disabled={disabled}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <Paperclip className="size-5 text-muted-foreground" />
            {fileName ? (
              <p className="text-sm font-semibold text-foreground truncate max-w-xs">
                {fileName}
              </p>
            ) : (
              <div>
                <p className="text-sm font-medium">
                  Click to select files or drag-and-drop
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Supports images & videos (max. 10MB)
                </p>
              </div>
            )}
          </div>
        </div>
        <input type="hidden" {...register} />
      </Field>
    );
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        placeholder={placeholder}
        className={className}
        {...register}
        disabled={disabled}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
