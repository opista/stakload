import { cn } from "@util/cn";
import type { ComponentProps } from "react";

export const SectionHeading = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("flex", className)} {...props} />
);
