import { cn } from "@util/cn";
import { ReactNode } from "react";

type SettingsTitleProps = {
  subtitle?: ReactNode;
  title: string;
};

export const SettingsTitle = ({ subtitle, title }: SettingsTitleProps) => {
  return (
    <>
      <h2 className={cn("text-xl font-bold", !subtitle && "mb-3")}>{title}</h2>
      {subtitle && <p className="mb-3 text-xs text-neutral-400">{subtitle}</p>}
    </>
  );
};
