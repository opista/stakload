import { NavbarLink } from "@components/Desktop/Navigation/NavbarLink/NavbarLink";
import { QuickAccessList } from "@components/Desktop/QuickAccess/QuickAccessList/QuickAccessList";
import Logo from "@components/Logo/Logo";
import { AppShell, Card, Flex, ScrollArea, Stack } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import type { IconProps } from "@tabler/icons-react";
import { IconBooks, IconCategory, IconDeviceGamepad, IconHome } from "@tabler/icons-react";
import { importDynamicIcon } from "@util/import-dynamic-icon";
import type { FC } from "react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import classes from "./Navbar.module.css";

export const Navbar = () => {
  const collections = useGameStore(useShallow((state) => state.collections));

  const iconCache = useMemo(() => {
    const cache = new Map<string, FC<IconProps>>();

    collections.forEach((collection) => {
      if (collection.icon && !cache.has(collection.icon)) {
        cache.set(collection.icon, importDynamicIcon(collection.icon, IconDeviceGamepad));
      }
    });

    return cache;
  }, [collections]);

  return (
    <AppShell.Navbar className={classes.navbar}>
      <Card className={classes.card}>
        <Flex className={classes.logoContainer}>
          <Logo />
        </Flex>
        <ScrollArea>
          <Stack gap="xs">
            <NavbarLink href="/desktop" icon={IconHome} label="Home" />
            <NavbarLink href="/desktop/games" icon={IconCategory} label="Library" />
            <NavbarLink icon={IconBooks} label="Collections">
              {collections.map((collection) => (
                <NavbarLink
                  href={`/desktop/collections/${collection._id}`}
                  icon={collection.icon ? iconCache.get(collection.icon) || IconDeviceGamepad : IconDeviceGamepad}
                  key={collection._id}
                  label={collection.name}
                />
              ))}
            </NavbarLink>
          </Stack>
          <QuickAccessList className={classes.quickAccess} />
        </ScrollArea>
      </Card>
    </AppShell.Navbar>
  );
};
