import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@util/cn";

type SettingsSelectProps = {
  data: (string | { label: string; value: string })[];
  label?: string;
  onChange: (value: string) => void;
  value?: string | null;
  className?: string;
};

export const SettingsSelect = ({ className, data, label, onChange, value }: SettingsSelectProps) => {
  return (
    <div className={cn("flex items-center justify-between py-1 mb-2", className)}>
      {label && <span className="text-sm font-semibold text-[#a0a7a9]">{label}</span>}
      <div className="relative">
        <select
          className="appearance-none rounded-lg bg-[#1b2c3b] px-3 py-1.5 pr-8 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          onChange={(e) => onChange(e.target.value)}
          value={value ?? ""}
        >
          {data.map((item) => {
            const val = typeof item === "string" ? item : item.value;
            const lab = typeof item === "string" ? item : item.label;
            return (
              <option key={val} value={val}>
                {lab}
              </option>
            );
          })}
        </select>
        <IconChevronDown
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500"
          size={14}
        />
      </div>
    </div>
  );
};
