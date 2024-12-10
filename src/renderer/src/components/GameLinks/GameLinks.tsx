import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { LikeWebsiteCategoryText, Website, WebsiteCategoryText } from "@contracts/database/games";
import { SimpleGrid } from "@mantine/core";
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

import { IconEpicGames } from "../../icons/IconEpicGames";
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
  <ActionIcon
    aria-label={label}
    icon={icon}
    onClick={() => window.api.openWebpage(url)}
    size="lg"
    title={label}
    variant="filled"
  />
);

type IconPropsMap = {
  icon: FC<IconProps>;
  label: string;
  formatter?: (url: string) => string;
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
  // TODO we will need to find an icon for this
  EPIC_GAMES: {
    icon: IconEpicGames,
    label: "Epic Games",
  },
  FACEBOOK: {
    icon: IconBrandFacebook,
    label: "Facebook",
  },
  // TODO we will need to find an icon for this
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
    label: "Offical website",
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
  // TODO we will need to find an icon for this
  WIKIA: {
    icon: IconQuestionMark,
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

type GameLinksProps = {
  websites?: Website[];
};

export const GameLinks = ({ websites }: GameLinksProps) => {
  const buttons = websites
    ?.filter(({ website }) => websiteIconPropsMap[website]) // Ensure valid categories
    .sort((a, b) => {
      const indexA = WEBSITE_ORDER.indexOf(a.website);
      const indexB = WEBSITE_ORDER.indexOf(b.website);

      // Categories not in the order array are sorted to the end
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    })
    .map(({ url, website }) => {
      const { icon, label, formatter } = websiteIconPropsMap[website];
      const formattedUrl = formatter?.(url) || url;
      return <WebsiteIcon key={website} icon={icon} label={label} url={formattedUrl} />;
    });

  return (
    <SimpleGrid cols={7} spacing="xs" verticalSpacing="xs">
      {buttons}
    </SimpleGrid>
  );
};
