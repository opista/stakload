import { ParseKeys } from "i18next";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TooltipIcon } from "@components/icons/tooltip-icon";
import { IdAndName } from "@stakload/contracts/database/games";

import { IconBrandProtonDb } from "../../icons/icon-brand-proton-db";

type ProtonIndicatorProps = {
  gameId?: string;
  platforms?: IdAndName[];
  size: "xs" | "sm" | "md" | "lg" | "xl";
};

type TierMetadata = {
  background: string;
  color: string;
  label: ParseKeys;
};

const TIER_MAP: { [key: string]: TierMetadata } = {
  borked: { background: "#ff0000", color: "#000", label: "protondb.borked" },
  bronze: { background: "#cd7f32", color: "#000", label: "protondb.bronze" },
  gold: { background: "#cfb53b", color: "#000", label: "protondb.gold" },
  native: { background: "#008000", color: "#fff", label: "protondb.native" },
  pending: { background: "#444", color: "#000", label: "protondb.pending" },
  platinum: {
    background: "#b4c7dc",
    color: "#000",
    label: "protondb.platinum",
  },
  silver: { background: "#a6a6a6", color: "#000", label: "protondb.silver" },
  unknown: { background: "#444", color: "#000", label: "protondb.unknown" },
} as const;

const ProtonIcon = memo(({ gameId, platforms, size }: ProtonIndicatorProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState<TierMetadata>(TIER_MAP.unknown);

  useEffect(() => {
    if (!gameId) return;

    setIsLoading(true);

    const isNative = platforms?.find(({ name }) => name.toLocaleLowerCase() === "linux");

    if (isNative) {
      setMetadata(TIER_MAP.native);
      setIsLoading(false);
      return;
    }

    window.ipc.game
      .getProtondbTier(gameId)
      .then((tier) => {
        const tierMetadata = (tier && TIER_MAP[tier]) || TIER_MAP.unknown;
        setMetadata(tierMetadata);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [gameId, platforms]);

  return (
    <a
      href={`https://www.protondb.com/app/${gameId}`}
      rel="noreferrer"
      target="_blank"
      className="inline-block transition-transform hover:scale-105"
    >
      <TooltipIcon
        icon={IconBrandProtonDb}
        iconProps={{ style: { color: metadata.color } }}
        loading={isLoading}
        themeIconProps={{
          size,
          style: { background: metadata.background, color: metadata.color },
        }}
        tooltipProps={{
          label: t("protondb.tier", { tier: `$t(${metadata.label})` }),
        }}
      />
    </a>
  );
});

ProtonIcon.displayName = "ProtonIcon";

export { ProtonIcon };
