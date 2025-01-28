import { GameSyncStatus } from "@components/Desktop/GameSyncStatus/GameSyncStatus";
import { NavbarLink } from "@components/Desktop/Navigation/NavbarLink/NavbarLink";
import { QuickLaunchList } from "@components/Desktop/QuickLaunch/QuickLaunchList/QuickLaunchList";
import { SearchButton } from "@components/Desktop/SearchButton/SearchButton";
import Logo from "@components/Logo/Logo";
import { AppShell, Card, Flex, ScrollArea, Stack } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import type { IconProps } from "@tabler/icons-react";
import {
  IconBooks,
  IconCategory,
  IconCommand,
  IconDeviceGamepad,
  IconDeviceImac,
  IconHome,
  IconLayersIntersect,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
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
        <SearchButton className={classes.search} />
        <ScrollArea className={classes.scrollArea}>
          <Stack gap="xs">
            <NavbarLink href="/desktop" icon={IconHome} label="Home" />
            <NavbarLink href="/desktop/library" icon={IconCategory} label="Library" />
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
            <NavbarLink icon={IconSettings} label="Settings">
              <NavbarLink href="/desktop/settings/interface" icon={IconDeviceImac} label="Interface" />
              <NavbarLink href="/desktop/settings/integrations" icon={IconLayersIntersect} label="Integrations" />
              <NavbarLink href="/desktop/settings/shortcuts" icon={IconCommand} label="Shortcuts" />
              <NavbarLink href="/desktop/settings/about" icon={IconUser} label="About" />
            </NavbarLink>
          </Stack>
          <QuickLaunchList className={classes.quickLaunch} />
          {/* Spacer so that game sync status doesn't cover navbar content */}
          <div className={classes.bottomSpacer} />
        </ScrollArea>
        <GameSyncStatus className={classes.gameSyncStatus} />
      </Card>
    </AppShell.Navbar>
  );
};
