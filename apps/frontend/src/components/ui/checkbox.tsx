import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { ComponentPropsWithoutRef } from "react";

type CheckboxProps = Omit<ComponentPropsWithoutRef<typeof BaseCheckbox.Root>, "children" | "onChange"> & {
  checked?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
};

export const Checkbox = ({ checked, className, label, onChange, ...props }: CheckboxProps) => {
  return (
    <BaseCheckbox.Root
      className={cn("inline-flex cursor-pointer items-center gap-3 py-1.5 focus:outline-none", className)}
      checked={checked}
      onCheckedChange={(newChecked) => onChange?.(newChecked === true)}
      {...props}
    >
      <div className="relative flex h-5 w-5 items-center justify-center rounded border border-neutral-700 bg-[#1b2c3b] transition-all focus-visible:ring-1 focus-visible:ring-cyan-500/50 data-[state=checked]:border-cyan-600 data-[state=checked]:bg-cyan-600">
        <BaseCheckbox.Indicator className="flex items-center justify-center">
          <IconCheck className="h-3.5 w-3.5 text-white" stroke={3} />
        </BaseCheckbox.Indicator>
      </div>
      {label && <span className="text-sm font-semibold text-[#a0a7a9]">{label}</span>}
    </BaseCheckbox.Root>
  );
};
