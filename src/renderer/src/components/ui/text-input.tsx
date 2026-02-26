import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { cn } from "@util/cn";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type TextInputProps = {
  label?: string;
  error?: string;
  description?: string;
  rightSection?: ReactNode;
} & ComponentPropsWithoutRef<"input">;

export const TextInput = ({ className, description, error, label, rightSection, ...props }: TextInputProps) => {
  return (
    <Field.Root className={cn("flex flex-col gap-1.5", className)} invalid={!!error}>
      {label && (
        <Field.Label className="text-[11px] font-black uppercase tracking-wider text-neutral-400">{label}</Field.Label>
      )}
      {description && <Field.Description className="text-[10px] text-neutral-500">{description}</Field.Description>}
      <div className="relative">
        <Input
          className={cn(
            "h-10 w-full rounded-lg bg-[#1b2c3b] px-3 text-sm font-medium text-white placeholder-neutral-500 transition-shadow focus:outline-none focus:ring-1 focus:ring-cyan-500",
            error && "border border-red-500 focus:ring-red-500",
            rightSection && "pr-10",
          )}
          {...props}
        />
        {rightSection && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">{rightSection}</div>
        )}
      </div>
      {error && <Field.Error className="text-[10px] font-bold text-red-500">{error}</Field.Error>}
    </Field.Root>
  );
};
