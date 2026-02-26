import { cn } from "@util/cn";
import { ElementType, HTMLAttributes } from "react";

export interface SubHeadingProps extends HTMLAttributes<HTMLSpanElement> {
  as?: ElementType;
}

export const SubHeading = ({ as, children, className, ...props }: SubHeadingProps) => {
  const Component = as || "span";

  return (
    <Component className={cn("font-sans text-xs font-black uppercase tracking-[0.4em]", className)} {...props}>
      {children}
    </Component>
  );
};
