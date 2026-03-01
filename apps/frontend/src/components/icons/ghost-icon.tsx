import { IconGhost3Filled } from "@icons/index";
import { cn } from "@util/cn";

type GhostIconProps = {
  className?: string;
  size?: number;
};

export const GhostIcon = ({ className, size = 100 }: GhostIconProps) => {
  return (
    <div className={cn("flex flex-col items-center", className)} style={{ width: size }}>
      <IconGhost3Filled className="animate-float" size={size} />
      <div className="animate-shadow mt-1 h-[6%] w-[58%] rounded-full bg-current opacity-20"></div>
    </div>
  );
};
