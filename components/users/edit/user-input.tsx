import * as React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserInputProps {
  id: string;
  label: string;
  inputType: "input" | "select";
  type?: string;
  register?: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  disabled?: boolean;

  // For select
  control?: any;
  name?: string;
  options?: { label: string; value: string }[];
  isBoolean?: boolean;
}

export function UserInput({
  id,
  label,
  inputType,
  type = "text",
  register,
  error,
  placeholder,
  disabled,
  control,
  name,
  options,
  isBoolean,
}: UserInputProps) {
  if (inputType === "select" && control && name && options) {
    return (
      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const currentValue = isBoolean
              ? field.value
                ? "true"
                : "false"
              : field.value;

            const selectedLabel = options.find(
              (opt) => opt.value === currentValue
            )?.label;

            return (
              <Select
                value={currentValue}
                onValueChange={(val) =>
                  field.onChange(isBoolean ? val === "true" : val)
                }
                disabled={disabled}
              >
                <SelectTrigger id={id} className="w-full">
                  <SelectValue placeholder={placeholder}>
                    {selectedLabel}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }}
        />
        {error && <FieldError>{error}</FieldError>}
      </Field>
    );
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...(register || {})}
        disabled={disabled}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
