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
  isSubItem?: boolean;
};

export const NavbarLink = ({ children, disabled, href, icon: Icon, isSubItem, label }: NavbarLinkProps) => {
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
      void navigate(href);
    }
  };

  if (isSubItem) {
    return (
      <button
        className={cn(
          "flex w-full cursor-pointer text-left focus:outline-none",
          "text-xs uppercase tracking-widest transition-colors",
          "text-slate-500 hover:text-primary",
          active && "text-primary",
          disabled && "cursor-not-allowed opacity-50 grayscale hover:text-slate-500",
        )}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <span className="flex-1 truncate">{label}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col">
      <button
        className={cn(
          "flex w-full  cursor-pointer items-center gap-4 rounded-lg px-3 py-3 transition-colors focus:outline-none",
          "text-slate-400",
          !active && "hover:text-primary hover:bg-white/5",
          active && "bg-primary/10 text-primary",
          disabled && "cursor-not-allowed opacity-50 grayscale hover:bg-transparent hover:text-slate-400",
        )}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <Icon className="shrink-0" size={20} />
        <span className="flex-1 truncate text-left text-xs font-bold uppercase tracking-wider">{label}</span>
        {hasChildren && (
          <IconChevronRight
            className={cn("shrink-0 transition-transform duration-200", isOpen && "rotate-90")}
            size={16}
          />
        )}
      </button>

      {hasChildren && isOpen && <div className="ml-8 mt-1 flex flex-col space-y-2">{children}</div>}
    </div>
  );
};
