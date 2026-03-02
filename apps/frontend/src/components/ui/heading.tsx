import { ElementType, forwardRef, HTMLAttributes } from "react";

import { cn } from "@util/cn";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
  className?: string;
  level?: HeadingLevel;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as, children, className, level = 1, ...props }, ref) => {
    const Component = as || (`h${level}` as ElementType);

    return (
      <Component ref={ref} className={cn("font-serif font-black uppercase", className)} {...props}>
        {children}
      </Component>
    );
  },
);
Heading.displayName = "Heading";
