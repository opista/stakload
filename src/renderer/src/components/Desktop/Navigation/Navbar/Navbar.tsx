import { GameSyncStatus } from "@components/Desktop/GameSyncStatus/GameSyncStatus";
import { NavbarLink } from "@components/Desktop/Navigation/NavbarLink/NavbarLink";
import { QuickLaunchList } from "@components/Desktop/QuickLaunch/QuickLaunchList/QuickLaunchList";
import { SearchButton } from "@components/Desktop/SearchButton/SearchButton";
import Logo from "@components/Logo/Logo";
import { AppShell, Card, Flex, ScrollArea, Stack } from "@mantine/core";
import { useCollectionStore } from "@store/collection.store";
import type { IconProps } from "@tabler/icons-react";
import {
  IconBooks,
  IconCategory,
  IconDeviceGamepad,
  IconHome,
  IconLayersIntersect,
  IconSettings,
  IconStar,
} from "@tabler/icons-react";
import { importDynamicIcon } from "@util/import-dynamic-icon";
import type { FC } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import classes from "./Navbar.module.css";

export const Navbar = () => {
  const { t } = useTranslation();
  const collections = useCollectionStore(useShallow((state) => state.collections));

  const iconCache = useMemo(() => {
    const cache = new Map<string, FC<IconProps>>();

    collections.forEach((collection) => {
      if (collection.icon && !cache.has(collection.icon)) {
        cache.set(collection.icon, importDynamicIcon(collection.icon) || IconDeviceGamepad);
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
        <ScrollArea>
          <Stack gap="xs">
            <NavbarLink href="/desktop" icon={IconHome} label={t("navigation.home")} />
            <NavbarLink href="/desktop/library" icon={IconCategory} label={t("navigation.library")} />
            <NavbarLink href="/desktop/favourites" icon={IconStar} label={t("navigation.favourites")} />
            <NavbarLink disabled={!collections?.length} icon={IconBooks} label={t("navigation.collections")}>
              {collections.map((collection) => (
                <NavbarLink
                  href={`/desktop/collections/${collection._id}`}
                  icon={collection.icon ? iconCache.get(collection.icon) || IconDeviceGamepad : IconDeviceGamepad}
                  key={collection._id}
                  label={collection.name}
                />
              ))}
            </NavbarLink>
            <NavbarLink icon={IconSettings} label={t("navigation.settings")}>
              <NavbarLink
                href="/desktop/settings/integrations"
                icon={IconLayersIntersect}
                label={t("navigation.integrations")}
              />
            </NavbarLink>
          </Stack>
          <QuickLaunchList className={classes.quickLaunch} />
        </ScrollArea>
        <GameSyncStatus />
      </Card>
    </AppShell.Navbar>
  );
};
