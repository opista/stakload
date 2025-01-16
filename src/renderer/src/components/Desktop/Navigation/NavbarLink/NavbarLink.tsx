import { NavLink, NavLinkProps } from "@mantine/core";
import { IconProps } from "@tabler/icons-react";
import clsx from "clsx";
import { FC, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

import classes from "./NavbarLink.module.css";

type NavbarLinkProps = NavLinkProps & {
  href?: string;
  icon: FC<IconProps>;
};

export const NavbarLink = ({ children, href, icon: Icon, label, ...rest }: NavbarLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const active = useMemo(() => location.pathname === href, [location]);

  return (
    <NavLink
      {...rest}
      childrenOffset={10}
      className={clsx(classes.navLink, { [classes.active]: active })}
      label={label}
      leftSection={<Icon size={20} stroke={1.5} />}
      noWrap
      onClick={() => href && navigate(href)}
    >
      {children}
    </NavLink>
  );
};
