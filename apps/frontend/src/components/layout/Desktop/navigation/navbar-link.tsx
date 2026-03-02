import { IconChevronRight, IconProps } from "@tabler/icons-react";
import { Children, FC, isValidElement, ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { cn } from "@util/cn";

type NavbarLinkProps = {
  children?: ReactNode;
  disabled?: boolean;
  href?: string;
  icon?: FC<IconProps>;
  label: string;
  isSubItem?: boolean;
};

export const NavbarLink = ({ children, disabled, href, icon: Icon, isSubItem, label }: NavbarLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const active = href ? location.pathname === href : false;
  const hasChildren = !!children;

  const isChildActive = (() => {
    if (!children) return false;
    return Children.toArray(children).some((child) => {
      if (isValidElement<{ href?: string }>(child)) {
        return child.props.href === location.pathname;
      }
      return false;
    });
  })();

  // Open by default if a child route is currently active
  const [isOpen, setIsOpen] = useState(isChildActive);

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
          "text-xs uppercase tracking-widest transition-all",
          "rounded-sm px-2 py-1.5 -ml-2",
          "focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary/40",
          !active &&
            "text-slate-500 hover:text-primary focus-visible:text-primary hover:bg-white/5 focus-visible:bg-white/5",
          active && "text-primary bg-primary/10 font-bold",
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
          "flex w-full cursor-pointer items-center gap-4 rounded-lg px-3 py-3 transition-all focus:outline-none",
          "focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary/40",
          // Default inactive state
          !active &&
            !isChildActive &&
            "text-slate-400 hover:text-primary hover:bg-white/5 focus-visible:text-primary focus-visible:bg-white/5",
          // Subtle active when expanded (child is active)
          isChildActive && isOpen && "text-primary hover:bg-white/5 focus-visible:bg-white/5",
          // Full active when collapsed (child active) OR directly active
          (active || (isChildActive && !isOpen)) && "bg-primary/10 text-primary",
          disabled && "cursor-not-allowed opacity-50 grayscale hover:bg-transparent hover:text-slate-400",
        )}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {Icon && <Icon className="shrink-0" size={20} />}
        <span className="flex-1 truncate text-left text-xs font-bold tracking-wider uppercase">{label}</span>
        {hasChildren && (
          <IconChevronRight
            className={cn("shrink-0 transition-transform duration-200", isOpen && "rotate-90")}
            size={16}
          />
        )}
      </button>

      {hasChildren && isOpen && <div className="mt-1 ml-8 flex flex-col space-y-1">{children}</div>}
    </div>
  );
};
