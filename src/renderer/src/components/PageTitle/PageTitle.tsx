import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";

export const PageTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={clsx("font-bold leading-[1.3] text-3xl", className)} {...props} />
  ),
);

PageTitle.displayName = "PageTitle";
