import { IconChevronRight, IconProps } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { FC, ReactNode, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

type NavbarLinkProps = {
  children?: ReactNode;
  disabled?: boolean;
  href?: string;
  icon: FC<IconProps>;
  label: string;
};

export const NavbarLink = ({ children, disabled, href, icon: Icon, label }: NavbarLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const active = useMemo(() => (href ? location.pathname === href : false), [location.pathname, href]);
  const hasChildren = !!children;

  const onClick = () => {
    if (disabled) return;

    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 focus:outline-none",
          "text-[#a0a7a9] hover:bg-[#1b2c3b] hover:text-white",
          active && "bg-[#1b2c3b] text-white",
          disabled && "cursor-not-allowed opacity-50 grayscale hover:bg-transparent",
        )}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <Icon className="shrink-0" size={20} stroke={1.5} />
        <span className="flex-1 truncate text-left">{label}</span>
        {hasChildren && (
          <IconChevronRight
            className={cn("shrink-0 transition-transform duration-200", isOpen && "rotate-90")}
            size={16}
            stroke={2}
          />
        )}
      </button>

      {hasChildren && isOpen && (
        <div className="ml-5 mt-1 flex flex-col gap-1 border-l border-white/10 pl-2">{children}</div>
      )}
    </div>
  );
};
