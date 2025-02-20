import { IconProps } from "@tabler/icons-react";
import { forwardRef } from "react";

export const IconBrandBattleNet = forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", size = 24, stroke, style, ...rest }, ref) => (
    <svg
      height={size}
      ref={ref}
      style={style}
      viewBox="0 0 600 580.4"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M439 215c-61-28-148-46-230-39 4-27 14-46 31-50 23-6 48 10 72 37 16 2 34 6 47 9C315 89 257 43 212 60 179 73 161 119 164 182c-44 9-78 26-100 50-1 1-4 5-3 6 1 1 3 0 4-1 25-18 58-27 101-34 6 67 34 151 81 219-26 10-47 11-59-2-16-17-16-46-4-81-6-15-12-32-16-45-49 79-60 152-23 182 28 23 77 15 130-18 30 33 62 55 93 62 2 0 6 1 7-1 1-1-2-2-3-3-28-13-53-37-79-70 55-39 114-105 149-180 22 17 33 35 28 52-7 23-32 37-68 44-10 13-22 27-31 36 93 3 162-24 169-71 6-36-26-74-81-103 14-43 17-81 7-112-1-2-2-5-4-5-1 0-1 3-1 4 3 31-5 64-21 104zM268 412c-39-63-62-137-62-212 74-2 150 15 214 53-35 65-88 122-153 159z"
        fill={color}
      />
    </svg>
  ),
);

IconBrandBattleNet.displayName = "IconBrandBattleNet";
