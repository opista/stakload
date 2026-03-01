import { Heading } from "@components/ui/heading";
import clsx from "clsx";
import { forwardRef, HTMLAttributes } from "react";

export const PageTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Heading ref={ref} className={clsx("font-black text-3xl tracking-widest uppercase", className)} {...props} />
  ),
);

PageTitle.displayName = "PageTitle";
