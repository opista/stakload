import { TooltipIcon } from "@components/TooltipIcon/TooltipIcon";
import { IdAndName } from "@contracts/database/games";
import { MantineSize, UnstyledButton } from "@mantine/core";
import { ParseKeys } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { IconProtonDB } from "../../icons/IconProtonDB";

type ProtonIndicatorProps = {
  gameId: string;
  platforms?: IdAndName[];
  size: MantineSize;
};

type TierMetadata = {
  background: string;
  color: string;
  label: ParseKeys;
};

const tierMap: { [key: string]: TierMetadata } = {
  native: {
    background: "#008000",
    color: "#fff",
    label: "protondb.native",
  },
  pending: {
    background: "#444",
    color: "#000",
    label: "protondb.pending",
  },
  unknown: {
    background: "#444",
    color: "#000",
    label: "protondb.unknown",
  },
  borked: {
    background: "#ff0000",
    color: "#000",
    label: "protondb.borked",
  },
  bronze: {
    background: "#cd7f32",
    color: "#000",
    label: "protondb.bronze",
  },
  silver: {
    background: "#a6a6a6",
    color: "#000",
    label: "protondb.silver",
  },
  gold: {
    background: "#cfb53b",
    color: "#000",
    label: "protondb.gold",
  },
  platinum: {
    background: "#b4c7dc",
    color: "#000",
    label: "protondb.platinum",
  },
};

const getTierMetadata = (tier: string | null) => {
  if (!tier) return tierMap.unknown;
  return tierMap[tier] || tierMap.unknown;
};

export const ProtonIcon = ({ gameId, platforms, size }: ProtonIndicatorProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState<TierMetadata>(tierMap.unknown);

  const onClick = () => {
    window.api.openWebpage(`https://www.protondb.com/app/${gameId}`);
  };

  useEffect(() => {
    if (!gameId) return;

    setIsLoading(true);

    const isNative = platforms?.find(({ name }) => name.toLowerCase() === "linux");

    if (isNative) {
      setMetadata(tierMap.native);
      setIsLoading(false);
      return;
    }

    window.api.getProtondbTier(gameId).then((tier) => {
      const tierMetadata = getTierMetadata(tier);
      setMetadata(tierMetadata);
      setIsLoading(false);
    });
  }, [gameId]);

  return (
    <UnstyledButton onClick={onClick}>
      <TooltipIcon
        icon={IconProtonDB}
        iconProps={{ style: { color: metadata.color } }}
        loading={isLoading}
        themeIconProps={{ size, style: { color: metadata.color, background: metadata.background } }}
        tooltipProps={{ label: t("protondb.tier", { tier: `$t(${metadata.label})` }) }}
      />
    </UnstyledButton>
  );
};
