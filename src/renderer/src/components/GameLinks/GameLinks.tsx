import ActionIcon from "@components/ActionIcon/ActionIcon";
import { LikeWebsiteCategoryText, Website, WebsiteCategoryText } from "@contracts/database/games";
import { Flex, UnstyledButton } from "@mantine/core";
import {
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
  IconProps,
  IconQuestionMark,
  IconWorldWww,
} from "@tabler/icons-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { IconEpicGames } from "../../icons/IconEpicGames";
import { IconFandom } from "../../icons/IconFandom";
import { IconGog } from "../../icons/IconGog";

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

type WebsiteIconProps = {
  icon: FC<IconProps>;
  label: string;
  url: string;
};

const WebsiteIcon = ({ icon, label, url }: WebsiteIconProps) => (
  <UnstyledButton component="a" href={url} rel="noreferrer" target="_blank">
    <ActionIcon aria-label={label} icon={icon} size="lg" title={label} variant="filled" />
  </UnstyledButton>
);

type IconPropsMap = {
  formatter?: (url: string) => string;
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
      icon: IconBrandDiscord,
      label: "Discord",
    },
    EPIC_GAMES: {
      icon: IconEpicGames,
      label: "Epic Games",
    },
    FACEBOOK: {
      icon: IconBrandFacebook,
      label: "Facebook",
    },
    GOG: {
      icon: IconGog,
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
      icon: IconBrandSteam,
      label: "Steam",
      formatter: (url: string) => `steam://openurl/${url}`,
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
      icon: IconFandom,
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
      const { icon, label, formatter } = websiteIconPropsMap[website];
      const formattedUrl = formatter?.(url) || url;
      return <WebsiteIcon icon={icon} key={website} label={label} url={formattedUrl} />;
    });

  return <Flex gap="xs">{buttons}</Flex>;
};
