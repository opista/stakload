import { cn } from "@util/cn";
import { ElementType, HTMLAttributes, ReactNode } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  level?: HeadingLevel;
}

export const Heading = ({ as, children, className, level = 1, ...props }: HeadingProps) => {
  const Component = as || (`h${level}` as ElementType);

  return (
    <Component className={cn("font-serif font-black uppercase", className)} {...props}>
      {children}
    </Component>
  );
};
