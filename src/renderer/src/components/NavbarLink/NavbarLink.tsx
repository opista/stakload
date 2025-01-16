import { NavLink } from "@mantine/core";
import { IconProps } from "@tabler/icons-react";
import clsx from "clsx";
import { FC, ReactNode, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

import classes from "./NavbarLink.module.css";

type NavbarLinkProps = {
  children?: ReactNode;
  href?: string;
  icon: FC<IconProps>;
  label: string;
};

export const NavbarLink = ({ children, href, icon: Icon, label }: NavbarLinkProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const active = useMemo(() => location.pathname === href, [location]);

  return (
    <NavLink
      childrenOffset={28}
      className={clsx(classes.navLink, { [classes.active]: active })}
      label={label}
      leftSection={<Icon size={20} stroke={1.5} />}
      onClick={() => href && navigate(href)}
    >
      {children}
    </NavLink>
  );
};
