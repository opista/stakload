import { ReactNode } from "react";

type GameDetailsTableRowProps = {
  label: string;
  value?: ReactNode | string;
};

export const GameDetailsTableRow = ({ label, value }: GameDetailsTableRowProps) => (
  <div className="flex justify-between gap-4 py-1">
    <span className="text-neutral-400">{label}</span>
    <span className="text-right text-white">{value}</span>
  </div>
);
