import { cn } from "@util/cn";

export interface RingProgressProps {
  className?: string;
  color?: string;
  rootColor?: string;
  size?: number;
  thickness?: number;
  value: number;
}

export const RingProgress = ({
  className,
  color = "text-cyan-500",
  rootColor = "text-neutral-800",
  size = 40,
  thickness = 4,
  value,
}: RingProgressProps) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ height: size, width: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="transparent"
          className={rootColor}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-[stroke-dashoffset] duration-350 ease-in-out", color)}
        />
      </svg>
    </div>
  );
};
