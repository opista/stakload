import { SHORTCUT_KEYS } from "@constants/shortcuts";
import { useCommandPaletteStore } from "@store/command-palette.store";
import { IconSearch } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { ComponentPropsWithoutRef, useEffect } from "react";

type SearchButtonProps = ComponentPropsWithoutRef<"button">;

export const SearchButton = ({ className, disabled, ...others }: SearchButtonProps) => {
  const open = useCommandPaletteStore((state) => state.open);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <button
      {...others}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-md bg-[#1b2c3b] pl-4 pr-2 text-left transition-colors hover:bg-[#25394d]",
        disabled && "cursor-not-allowed bg-neutral-800 text-neutral-500 opacity-50",
        className,
      )}
      disabled={disabled}
      onClick={() => !disabled && open()}
      type="button"
    >
      <div className="flex flex-1 items-center gap-2">
        <IconSearch className="h-4 w-4" stroke={1.5} />
        <span className="text-sm">Search</span>
      </div>
      {!disabled && (
        <span className="ml-auto rounded border border-neutral-700 bg-neutral-900 px-1.5 py-1 text-[11px] font-bold text-neutral-400">
          {SHORTCUT_KEYS.SEARCH.join(" + ")}
        </span>
      )}
    </button>
  );
};
