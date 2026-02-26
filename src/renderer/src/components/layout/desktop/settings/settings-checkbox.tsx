import { Tooltip } from "@components/ui/tooltip";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { cn } from "@util/cn";

type SettingsCheckboxProps = {
  checked: boolean;
  label: string;
  labelInfo?: string;
  onCheckboxChange: (checked: boolean) => void;
  disabled?: boolean;
};

export const SettingsCheckbox = ({ checked, disabled, label, labelInfo, onCheckboxChange }: SettingsCheckboxProps) => (
  <div className={cn("flex items-center justify-between py-1 mb-2", disabled && "opacity-50 pointer-events-none")}>
    <div className="flex items-center gap-1.5 flex-1">
      <span className="text-sm font-semibold text-[#a0a7a9]">{label}</span>
      {labelInfo && (
        <Tooltip label={labelInfo}>
          <IconInfoSquareRounded className="text-neutral-500 hover:text-neutral-400 shrink-0" size={14} />
        </Tooltip>
      )}
    </div>
    <button
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        checked ? "bg-cyan-500" : "bg-[#1b2c3b]",
      )}
      onClick={() => !disabled && onCheckboxChange(!checked)}
      role="switch"
      aria-checked={checked}
      type="button"
      disabled={disabled}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  </div>
);
