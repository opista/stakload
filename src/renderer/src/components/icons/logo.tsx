import clsx from "clsx";
import { memo } from "react";

type LogoProps = {
  className?: string;
};

const Logo = memo(({ className }: LogoProps) => (
  <div className={clsx("text-white uppercase font-bold font-serif text-xl", className)}>Stakload</div>
));

Logo.displayName = "Logo";

export { Logo };
