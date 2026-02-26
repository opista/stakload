import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";

export const PageTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={clsx("font-black text-3xl tracking-widest uppercase", className)} {...props} />
  ),
);

PageTitle.displayName = "PageTitle";
