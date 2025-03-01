import ActionIcon from "@components/ActionIcon/ActionIcon";
import { ConditionalWrapper } from "@components/ConditionalWrapper/ConditionalWrapper";
import { LikeWebsiteType, Website } from "@contracts/database/games";
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

const WEBSITE_ORDER: LikeWebsiteType[] = [
  "official",
  "steam",
  "epicgames",
  "gog",
  "discord",
  "twitch",
  "youtube",
  "reddit",
  "twitter",
  "wikia",
  "facebook",
  "instagram",
  "wikipedia",
  "itch",
  "android",
  "iphone",
  "ipad",
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
  return (
    <Menu arrowOffset={16} position="bottom-start" width={200} withArrow>
      <MenuTarget>
        <ActionIcon aria-label={label} icon={icon} size="lg" title={label} variant="filled" />
      </MenuTarget>

      <MenuDropdown>
        <MenuItem component="a" href={deepLink} leftSection={<IconApps size="16" />} target="_blank">
          {t("links.application")}
        </MenuItem>
        <MenuItem component="a" href={url} leftSection={<IconExternalLink size="16" />} target="_blank">
          {t("links.website")}
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

  const websiteIconPropsMap: Record<LikeWebsiteType, IconPropsMap> = {
    android: {
      icon: IconBrandAndroid,
      label: "Android",
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
      icon: IconBrandX,
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
      const { icon, label, deepLinkFormatter } = websiteIconPropsMap[websiteType];
      const deepLink = deepLinkFormatter?.(url);

      return deepLink ? (
        <Dropdown deepLink={deepLink} icon={icon} key={websiteType} label={label} url={url} />
      ) : (
        <WebsiteIcon icon={icon} key={websiteType} label={label} url={url} />
      );
    });

  return (
    <Flex gap="xs" wrap="wrap">
      {buttons}
    </Flex>
  );
};
