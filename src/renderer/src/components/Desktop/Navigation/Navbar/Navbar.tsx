import { GameSyncStatus } from "@components/Desktop/GameSyncStatus/GameSyncStatus";
import { NavbarLink } from "@components/Desktop/Navigation/NavbarLink/NavbarLink";
import { QuickLaunchList } from "@components/Desktop/QuickLaunch/QuickLaunchList/QuickLaunchList";
import { SearchButton } from "@components/Desktop/SearchButton/SearchButton";
import { Logo } from "@components/Logo/Logo";
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
    <aside className="w-[300px] shrink-0 p-4 pt-0">
      <div className="flex h-full flex-col rounded-[2rem] bg-[var(--color)] px-4 pb-4 shadow-xl">
        <div className="flex h-[100px] shrink-0 items-center justify-center">
          <Logo />
        </div>
        <SearchButton className="mb-8 shrink-0" />
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
          <div className="flex flex-col gap-1">
            <NavbarLink href="/" icon={IconHome} label={t("navigation.home")} />
            <NavbarLink href="/library" icon={IconCategory} label={t("navigation.library")} />
            <NavbarLink href="/favourites" icon={IconStar} label={t("navigation.favourites")} />
            <NavbarLink disabled={!collections?.length} icon={IconBooks} label={t("navigation.collections")}>
              {collections.map((collection) => (
                <NavbarLink
                  href={`/collections/${collection._id}`}
                  icon={collection.icon ? iconCache.get(collection.icon) || IconDeviceGamepad : IconDeviceGamepad}
                  key={collection._id}
                  label={collection.name}
                />
              ))}
            </NavbarLink>
            <NavbarLink icon={IconSettings} label={t("navigation.settings")}>
              <NavbarLink
                href="/settings/integrations"
                icon={IconLayersIntersect}
                label={t("navigation.integrations")}
              />
            </NavbarLink>
          </div>
          <QuickLaunchList className="mt-[60px]" />
        </div>
        <GameSyncStatus />
      </div>
    </aside>
  );
};
