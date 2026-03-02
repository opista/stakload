import { cn } from "@util/cn";
import { ReactNode } from "react";

type ContentCardProps = {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
};

export const ContentCard = ({ children, className, title }: ContentCardProps) => (
  <div className={cn("content-card pt-4 px-6 pb-6 bg-neutral-600/30 rounded-2xl [&+.content-card]:mt-6", className)}>
    {title && <h2 className="mb-3 text-2xl leading-snug font-bold">{title}</h2>}
    {children}
  </div>
);
