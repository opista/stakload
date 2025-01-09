import { TooltipIcon } from "@components/TooltipIcon/TooltipIcon";
import { IdAndName } from "@contracts/database/games";
import { MantineSize, UnstyledButton } from "@mantine/core";
import { ParseKeys } from "i18next";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { IconProtonDB } from "../../icons/IconProtonDB";

type ProtonIndicatorProps = {
  gameId?: string;
  platforms?: IdAndName[];
  size: MantineSize;
};

type TierMetadata = {
  background: string;
  color: string;
  label: ParseKeys;
};

const TIER_MAP: { [key: string]: TierMetadata } = {
  native: { background: "#008000", color: "#fff", label: "protondb.native" },
  pending: { background: "#444", color: "#000", label: "protondb.pending" },
  unknown: { background: "#444", color: "#000", label: "protondb.unknown" },
  borked: { background: "#ff0000", color: "#000", label: "protondb.borked" },
  bronze: { background: "#cd7f32", color: "#000", label: "protondb.bronze" },
  silver: { background: "#a6a6a6", color: "#000", label: "protondb.silver" },
  gold: { background: "#cfb53b", color: "#000", label: "protondb.gold" },
  platinum: { background: "#b4c7dc", color: "#000", label: "protondb.platinum" },
} as const;

const ProtonIcon = memo(({ gameId, platforms, size }: ProtonIndicatorProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState<TierMetadata>(TIER_MAP.unknown);

  useEffect(() => {
    if (!gameId) return;

    setIsLoading(true);

    const isNative = platforms?.find(({ name }) => name.toLowerCase() === "linux");

    if (isNative) {
      setMetadata(TIER_MAP.native);
      setIsLoading(false);
      return;
    }

    window.api
      .getProtondbTier(gameId)
      .then((tier) => {
        const tierMetadata = (tier && TIER_MAP[tier]) || TIER_MAP.unknown;
        setMetadata(tierMetadata);
      })
      .catch((err) => {
        // TODO - log error
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [gameId, platforms]);

  return (
    <UnstyledButton component="a" href={`https://www.protondb.com/app/${gameId}`} rel="noreferrer" target="_blank">
      <TooltipIcon
        icon={IconProtonDB}
        iconProps={{ style: { color: metadata.color } }}
        loading={isLoading}
        themeIconProps={{ size, style: { color: metadata.color, background: metadata.background } }}
        tooltipProps={{ label: t("protondb.tier", { tier: `$t(${metadata.label})` }) }}
      />
    </UnstyledButton>
  );
});

ProtonIcon.displayName = "ProtonIcon";

export default ProtonIcon;
