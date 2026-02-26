import { Select as BaseSelect } from "@base-ui/react";
import { Badge } from "@components/ui/Badge";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { cn } from "@util/cn";

export interface SelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  className?: string;
  clearable?: boolean;
  data: (string | SelectOption)[];
  label?: string;
  onChange?: (value: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  value?: string[];
}

export const MultiSelect = ({
  className,
  clearable,
  data,
  label,
  onChange,
  placeholder,
  value = [],
}: MultiSelectProps) => {
  const options = data.map((item) => {
    if (typeof item === "string") return { label: item, value: item };
    return item;
  });

  const handleRemove = (val: string) => {
    onChange?.(value.filter((v) => v !== val));
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{label}</label>}

      <BaseSelect.Root multiple value={value} onValueChange={(newVal: any) => onChange?.(newVal as string[])}>
        <BaseSelect.Trigger
          render={<div />}
          nativeButton={false}
          className="flex min-h-[42px] w-full flex-wrap items-center gap-1.5 rounded-xl bg-neutral-800/50 p-2 text-sm text-white ring-1 ring-white/10 transition-all hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {value.map((val) => {
                const option = options.find((o) => o.value === val);
                return (
                  <Badge key={val} variant="filled" className="flex items-center gap-1 py-0.5">
                    {option?.label || val}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(val);
                      }}
                      className="rounded-full hover:bg-black/20"
                    >
                      <IconX size={12} />
                    </button>
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span className="text-neutral-500 pl-1">{placeholder || "Select items..."}</span>
          )}
          <div className="ml-auto flex items-center gap-1 pr-1">
            {clearable && value.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.([]);
                }}
                className="text-neutral-500 hover:text-white"
              >
                <IconX size={14} />
              </button>
            )}
            <BaseSelect.Icon>
              <IconChevronDown size={16} className="text-neutral-500" />
            </BaseSelect.Icon>
          </div>
        </BaseSelect.Trigger>

        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={8} className="z-[2000] w-[var(--trigger-width)]">
            <BaseSelect.Popup className="max-h-[300px] overflow-y-auto rounded-xl bg-neutral-900 p-1 shadow-2xl ring-1 ring-white/10 outline-none animate-in fade-in zoom-in-95 duration-150">
              <BaseSelect.List>
                {options.map((option) => (
                  <BaseSelect.Item
                    key={option.value}
                    value={option.value}
                    className="flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm text-neutral-300 outline-none hover:bg-white/5 data-[highlighted]:bg-cyan-500 data-[selected]:bg-cyan-500 data-[selected]:text-white data-[highlighted]:text-white"
                  >
                    <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
};
