import { ScrollArea } from "@base-ui/react";
import { Logo } from "@components/icons/logo";
import { useCollectionStore } from "@store/collection.store";
import { useNotificationStore } from "@store/notification.store";
import type { IconProps } from "@tabler/icons-react";
import {
  IconBell,
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

import { GameSyncStatus } from "../game-sync-status";
import { QuickLaunchList } from "../quick-launch/quick-launch-list";

import { NavbarIconButton } from "./navbar-icon-button";
import { NavbarLink } from "./navbar-link";

export const Navbar = () => {
  const { t } = useTranslation();
  const collections = useCollectionStore(useShallow((state) => state.collections));
  const { hasNotifications, toggleDrawer } = useNotificationStore(
    useShallow((state) => ({
      hasNotifications: !!state.notifications.length,
      toggleDrawer: state.toggleDrawer,
    })),
  );

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
    <aside className="flex flex-col h-full w-[260px] shrink-0 p-6 bg-stone-950 border-r border-white/5">
      <div className="flex shrink-0 items-center justify-center pb-8">
        <Logo />
      </div>

      <ScrollArea.Root className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea.Viewport className="h-full w-full outline-none">
          <nav className="flex flex-col space-y-2 pb-4">
            <NavbarLink href="/" icon={IconHome} label={t("navigation.home")} />
            <NavbarLink href="/library" icon={IconCategory} label={t("navigation.library")} />
            <NavbarLink href="/favourites" icon={IconStar} label={t("navigation.favourites")} />

            <NavbarLink disabled={!collections?.length} icon={IconBooks} label={t("navigation.collections")}>
              {collections.map((collection) => (
                <NavbarLink
                  isSubItem
                  href={`/collections/${collection._id}`}
                  icon={collection.icon ? iconCache.get(collection.icon) || IconDeviceGamepad : IconDeviceGamepad}
                  key={collection._id}
                  label={collection.name}
                />
              ))}
            </NavbarLink>
          </nav>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="flex touch-none select-none p-0.5 bg-black/10 hover:bg-black/20 w-1.5 transition-colors rounded-full mt-2 mb-2">
          <ScrollArea.Thumb className="flex-1 bg-white/10 hover:bg-white/20 rounded-full relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      <QuickLaunchList className="mt-8" />

      <GameSyncStatus />

      <div className="pt-6 mt-6 border-t border-white/5 flex gap-2">
        <NavbarIconButton className="grow" href="/integrations" label="Integrations" icon={IconLayersIntersect} />
        <NavbarIconButton className="grow" label="Settings" icon={IconSettings} />
        <NavbarIconButton
          className="grow"
          label="Notifications"
          icon={IconBell}
          onClick={toggleDrawer}
          indicator={hasNotifications}
        />
      </div>
    </aside>
  );
};
