import { Tooltip } from "@components/ui/tooltip";
import type { IconProps } from "@tabler/icons-react";
import { cn } from "@util/cn";
import type { FC } from "react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

type NavbarIconButtonProps = {
  className?: string;
  href?: string;
  icon: FC<IconProps>;
  indicator?: boolean;
  onClick?: () => void;
  label: string;
};

export const NavbarIconButton = ({ className, href, icon: Icon, indicator, label, onClick }: NavbarIconButtonProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const active = useMemo(() => (href ? location.pathname === href : false), [location.pathname, href]);

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      void navigate(href);
    }
  };

  return (
    <Tooltip label={label} side="top" align="center">
      <button
        className={cn(
          "flex w-full cursor-pointer items-center justify-center rounded-lg px-3 py-3 transition-all focus:outline-none",
          "text-slate-400",
          "focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary/40",
          !active && "hover:text-primary hover:bg-white/5 focus-visible:text-primary focus-visible:bg-white/5",
          active && "bg-primary/10 text-primary",
          className,
        )}
        onClick={handleOnClick}
        type="button"
      >
        <div className="relative shrink-0 flex items-center justify-center">
          <Icon size={20} />
          {indicator && (
            <div className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border border-neutral-900 bg-red-500 ring-2 ring-red-500/50 animate-pulse" />
          )}
        </div>
      </button>
    </Tooltip>
  );
};
