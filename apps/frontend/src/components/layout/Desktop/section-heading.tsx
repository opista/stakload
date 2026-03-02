import type { ComponentProps } from "react";

import { cn } from "@util/cn";

export const SectionHeading = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("flex", className)} {...props} />
);
