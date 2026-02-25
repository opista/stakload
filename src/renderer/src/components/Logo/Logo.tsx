import clsx from "clsx";
import { memo } from "react";

type LogoProps = {
  className?: string;
  useGradient?: boolean;
};

const Logo = memo(({ className, useGradient = true }: LogoProps) => (
  <div className={clsx("bg-white rounded-md px-3 w-fit", className)}>
    <span
      className={clsx(
        "inline-block font-black no-underline text-xl",
        useGradient ? "bg-gradient-to-br from-purple-600 to-blue-500 bg-clip-text text-transparent" : "text-black",
      )}
    >
      Stakload
    </span>
  </div>
));

Logo.displayName = "Logo";

export default Logo;
