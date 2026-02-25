import ActionIcon from "@components/ActionIcon/ActionIcon";
import { ConditionalWrapper } from "@components/ConditionalWrapper/ConditionalWrapper";
import { LikeWebsiteType, Website } from "@contracts/database/games";
import {
  IconApps,
  IconBrandAndroid,
  IconBrandApple,
  IconBrandBluesky,
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandItch,
  IconBrandReddit,
  IconBrandSteam,
  IconBrandTwitch,
  IconBrandTwitter,
  IconBrandWikipedia,
  IconBrandYoutube,
  IconDeviceTablet,
  IconExternalLink,
  IconProps,
  IconQuestionMark,
  IconWorldWww,
} from "@tabler/icons-react";
import { FC, forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { IconBrandEpicGames } from "../../icons/IconBrandEpicGames";
import { IconBrandFandom } from "../../icons/IconBrandFandom";
import { IconBrandGog } from "../../icons/IconBrandGog";

const WEBSITE_ORDER: LikeWebsiteType[] = [
  "official",
  "steam",
  "epicgames",
  "gog",
  "discord",
  "twitch",
  "youtube",
  "reddit",
  "bluesky",
  "wikia",
  "facebook",
  "instagram",
  "wikipedia",
  "itch",
  "android",
  "iphone",
  "ipad",
  "twitter",
];

type DropdownProps = WebsiteIconProps & {
  deepLink: string;
};

type WebsiteIconProps = {
  icon: FC<IconProps>;
  label: string;
  url?: string;
};

const Dropdown = ({ deepLink, icon, label, url }: DropdownProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <ActionIcon
        aria-label={label}
        icon={icon}
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        title={label}
        variant="filled"
      />

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg bg-[#1b2c3b] p-1 shadow-xl ring-1 ring-white/10">
            <a
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold hover:bg-neutral-700/50"
              href={deepLink}
              onClick={() => setIsOpen(false)}
              target="_blank"
              rel="noreferrer"
            >
              <IconApps size={16} />
              {t("links.application")}
            </a>
            <a
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold hover:bg-neutral-700/50"
              href={url}
              onClick={() => setIsOpen(false)}
              target="_blank"
              rel="noreferrer"
            >
              <IconExternalLink size={16} />
              {t("links.website")}
            </a>
          </div>
        </>
      )}
    </div>
  );
};

const WebsiteIcon = forwardRef<HTMLAnchorElement, WebsiteIconProps>(function WebsiteIcon({ icon, label, url }, ref) {
  return (
    <ConditionalWrapper
      condition={!!url}
      wrapper={(children) => (
        <a href={url} ref={ref} rel="noreferrer" target="_blank">
          {children}
        </a>
      )}
    >
      <ActionIcon aria-label={label} icon={icon} size="lg" title={label} variant="filled" />
    </ConditionalWrapper>
  );
});

type IconPropsMap = {
  deepLinkFormatter?: (url: string) => string | undefined;
  icon: FC<IconProps>;
  label: string;
};

type GameLinksProps = {
  websites?: Website[];
};

export const GameLinks = ({ websites }: GameLinksProps) => {
  const { t } = useTranslation();

  const defaultIcon = {
    icon: IconQuestionMark,
    label: t("links.unknown"),
  };

  const websiteIconPropsMap: Record<LikeWebsiteType, IconPropsMap> = {
    android: {
      icon: IconBrandAndroid,
      label: "Android",
    },
    bluesky: {
      icon: IconBrandBluesky,
      label: "Bluesky",
    },
    discord: {
      deepLinkFormatter: (url: string) => {
        const [, id] = url.split("/invite/");

        if (!id) return;

        return `discord://invite/${id}`;
      },
      icon: IconBrandDiscord,
      label: "Discord",
    },
    epicgames: {
      deepLinkFormatter: (url: string) => {
        const [, slug] = url.match(/(?:product\/|p\/)([\w-]+)/) || [];

        if (!slug) return;

        return `com.epicgames.launcher://store/p/${slug}`;
      },
      icon: IconBrandEpicGames,
      label: "Epic Games",
    },
    facebook: {
      icon: IconBrandFacebook,
      label: "Facebook",
    },
    gog: {
      icon: IconBrandGog,
      label: "GOG",
    },
    instagram: {
      icon: IconBrandInstagram,
      label: "Instagram",
    },
    ipad: {
      icon: IconDeviceTablet,
      label: "iPad",
    },
    iphone: {
      icon: IconBrandApple,
      label: "iPhone",
    },
    itch: {
      icon: IconBrandItch,
      label: "Itch",
    },
    official: {
      icon: IconWorldWww,
      label: t("links.officialWebsite"),
    },
    reddit: {
      icon: IconBrandReddit,
      label: "Reddit",
    },
    steam: {
      deepLinkFormatter: (url: string) => `steam://openurl/${url}`,
      icon: IconBrandSteam,
      label: "Steam",
    },
    twitch: {
      icon: IconBrandTwitch,
      label: "Twitch",
    },
    twitter: {
      icon: IconBrandTwitter,
      label: "Twitter",
    },
    wikia: {
      icon: IconBrandFandom,
      label: "Fandom",
    },
    wikipedia: {
      icon: IconBrandWikipedia,
      label: "Wikipedia",
    },
    youtube: {
      icon: IconBrandYoutube,
      label: "YouTube",
    },
  };

  const buttons = websites
    ?.filter(({ websiteType }) => websiteIconPropsMap[websiteType] || defaultIcon)
    .sort((a, b) => {
      const indexA = WEBSITE_ORDER.indexOf(a.websiteType);
      const indexB = WEBSITE_ORDER.indexOf(b.websiteType);
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    })
    .map(({ url, websiteType }) => {
      const { deepLinkFormatter, icon, label } = websiteIconPropsMap[websiteType] || defaultIcon;
      const deepLink = deepLinkFormatter?.(url);

      return deepLink ? (
        <Dropdown deepLink={deepLink} icon={icon} key={websiteType} label={label} url={url} />
      ) : (
        <WebsiteIcon icon={icon} key={websiteType} label={label} url={url} />
      );
    });

  return <div className="flex flex-wrap gap-2">{buttons}</div>;
};
