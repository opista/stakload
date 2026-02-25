import { IconCheck } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { ComponentPropsWithoutRef } from "react";

type CheckboxProps = {
  label?: string;
} & ComponentPropsWithoutRef<"input">;

export const Checkbox = ({ checked, className, label, onChange, ...props }: CheckboxProps) => {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-3 py-1.5", className)}>
      <div className="relative flex items-center justify-center">
        <input
          {...props}
          type="checkbox"
          className="peer h-5 w-5 appearance-none rounded border border-neutral-700 bg-[#1b2c3b] transition-all checked:bg-cyan-600 checked:border-cyan-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          checked={checked}
          onChange={onChange}
        />
        <IconCheck
          className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
          stroke={3}
        />
      </div>
      {label && <span className="text-sm font-semibold text-[#a0a7a9]">{label}</span>}
    </label>
  );
};
