import { Tooltip, UnstyledButton } from "@mantine/core";
import { useNetwork } from "@mantine/hooks";
import { Icon, IconWifi, IconWifiOff } from "@tabler/icons-react";
import { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";

import classes from "./NetworkIndicator.module.css";

type IndicatorConfig = {
  Icon: Icon;
  iconColor?: string;
  label: ParseKeys;
};

const onlineConfig: IndicatorConfig = {
  Icon: IconWifi,
  label: "network.online",
};

const offlineConfig: IndicatorConfig = {
  Icon: IconWifiOff,
  iconColor: "var(--mantine-color-red-8)",
  label: "network.offline",
};

export const NetworkIndicator = () => {
  const { t } = useTranslation();
  const { online } = useNetwork();

  const config = online ? onlineConfig : offlineConfig;
  const { label, Icon, iconColor } = config;

  return (
    <Tooltip events={{ hover: true, focus: true, touch: false }} label={t(label)} withArrow>
      <UnstyledButton className={classes.button}>
        <Icon color={iconColor} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
};
