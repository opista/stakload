import ActionIcon from "@components/ActionIcon/ActionIcon";
import { ConditionalWrapper } from "@components/ConditionalWrapper/ConditionalWrapper";
import { LikeWebsiteCategoryText, Website, WebsiteCategoryText } from "@contracts/database/games";
import { Flex, Menu, MenuDropdown, MenuItem, MenuTarget, UnstyledButton } from "@mantine/core";
import {
  IconApps,
  IconBrandAndroid,
  IconBrandApple,
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandItch,
  IconBrandReddit,
  IconBrandSteam,
  IconBrandTwitch,
  IconBrandWikipedia,
  IconBrandX,
  IconBrandYoutube,
  IconDeviceTablet,
  IconExternalLink,
  IconProps,
  IconQuestionMark,
  IconWorldWww,
} from "@tabler/icons-react";
import { FC, forwardRef } from "react";
import { useTranslation } from "react-i18next";

import { IconBrandEpicGames } from "../../icons/IconBrandEpicGames";
import { IconBrandFandom } from "../../icons/IconBrandFandom";
import { IconBrandGog } from "../../icons/IconBrandGog";

const WEBSITE_ORDER: LikeWebsiteCategoryText[] = [
  "OFFICIAL",
  "STEAM",
  "EPIC_GAMES",
  "GOG",
  "DISCORD",
  "TWITCH",
  "YOUTUBE",
  "REDDIT",
  "TWITTER",
  "WIKIA",
  "FACEBOOK",
  "INSTAGRAM",
  "WIKIPEDIA",
  "ITCH",
  "ANDROID",
  "IPHONE",
  "IPAD",
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
  return (
    <Menu arrowOffset={16} position="bottom-start" width={200} withArrow>
      <MenuTarget>
        <ActionIcon aria-label={label} icon={icon} size="lg" title={label} variant="filled" />
      </MenuTarget>

      <MenuDropdown>
        <MenuItem component="a" href={deepLink} leftSection={<IconApps size="16" />} target="_blank">
          Application
        </MenuItem>
        <MenuItem component="a" href={url} leftSection={<IconExternalLink size="16" />} target="_blank">
          Website
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
};

const WebsiteIcon = forwardRef<HTMLButtonElement, WebsiteIconProps>(function WebsiteIcon({ icon, label, url }, ref) {
  return (
    <ConditionalWrapper
      condition={!!url}
      wrapper={(children) => (
        <UnstyledButton component="a" href={url} rel="noreferrer" target="_blank">
          {children}
        </UnstyledButton>
      )}
    >
      <ActionIcon aria-label={label} icon={icon} ref={ref} size="lg" title={label} variant="filled" />
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

  const websiteIconPropsMap: Record<WebsiteCategoryText, IconPropsMap> = {
    ANDROID: {
      icon: IconBrandAndroid,
      label: "Android",
    },
    DISCORD: {
      deepLinkFormatter: (url: string) => {
        const [, id] = url.split("/invite/");

        if (!id) return;

        return `discord://invite/${id}`;
      },
      icon: IconBrandDiscord,
      label: "Discord",
    },
    EPIC_GAMES: {
      deepLinkFormatter: (url: string) => {
        const [, slug] = url.match(/(?:product\/|p\/)([\w-]+)/) || [];

        if (!slug) return;

        return `com.epicgames.launcher://store/p/${slug}`;
      },
      icon: IconBrandEpicGames,
      label: "Epic Games",
    },
    FACEBOOK: {
      icon: IconBrandFacebook,
      label: "Facebook",
    },
    GOG: {
      icon: IconBrandGog,
      label: "GOG",
    },
    INSTAGRAM: {
      icon: IconBrandInstagram,
      label: "Instagram",
    },
    IPAD: {
      icon: IconDeviceTablet,
      label: "iPad",
    },
    IPHONE: {
      icon: IconBrandApple,
      label: "iPhone",
    },
    ITCH: {
      icon: IconBrandItch,
      label: "Itch",
    },
    OFFICIAL: {
      icon: IconWorldWww,
      label: t("links.officialWebsite"),
    },
    REDDIT: {
      icon: IconBrandReddit,
      label: "Reddit",
    },
    STEAM: {
      deepLinkFormatter: (url: string) => `steam://openurl/${url}`,
      icon: IconBrandSteam,
      label: "Steam",
    },
    TWITCH: {
      icon: IconBrandTwitch,
      label: "Twitch",
    },
    TWITTER: {
      icon: IconBrandX,
      label: "Twitter",
    },
    WIKIA: {
      icon: IconBrandFandom,
      label: "Fandom",
    },
    WIKIPEDIA: {
      icon: IconBrandWikipedia,
      label: "Wikipedia",
    },
    YOUTUBE: {
      icon: IconBrandYoutube,
      label: "YouTube",
    },
  };

  const buttons = websites
    ?.filter(({ website }) => websiteIconPropsMap[website] || defaultIcon)
    .sort((a, b) => {
      const indexA = WEBSITE_ORDER.indexOf(a.website);
      const indexB = WEBSITE_ORDER.indexOf(b.website);
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    })
    .map(({ url, website }) => {
      const { icon, label, deepLinkFormatter } = websiteIconPropsMap[website];
      const deepLink = deepLinkFormatter?.(url);

      return deepLink ? (
        <Dropdown deepLink={deepLink} icon={icon} key={website} label={label} url={url} />
      ) : (
        <WebsiteIcon icon={icon} key={website} label={label} url={url} />
      );
    });

  return (
    <Flex gap="xs" wrap="wrap">
      {buttons}
    </Flex>
  );
};
