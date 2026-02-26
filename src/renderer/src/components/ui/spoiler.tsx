import { cn } from "@util/cn";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

export interface SpoilerProps {
  children: ReactNode;
  initialState?: boolean;
  maxHeight: number;
}

export const Spoiler = ({ children, initialState = false, maxHeight }: SpoilerProps) => {
  const [expanded, setExpanded] = useState(initialState);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "relative overflow-hidden transition-[max-height] duration-300 ease-in-out",
          !expanded &&
          "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-12 after:bg-gradient-to-t after:from-[#2b2b2b] after:to-transparent",
        )}
        style={{ maxHeight: expanded ? "none" : maxHeight }}
      >
        {children}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="self-start text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors"
      >
        {expanded ? t("spoiler.hide") : t("spoiler.showMore")}
      </button>
    </div>
  );
};
