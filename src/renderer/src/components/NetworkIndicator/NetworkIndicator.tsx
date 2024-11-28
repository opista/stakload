import { Tooltip, UnstyledButton } from "@mantine/core";
import { useNetwork } from "@mantine/hooks";
import { Icon, IconWifi, IconWifiOff } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import classes from "./NetworkIndicator.module.css";
import { ParseKeys } from "i18next";

type IndicatorConfig = {
  label: ParseKeys;
  Icon: Icon;
  iconColor?: string;
};

const onlineConfig: IndicatorConfig = {
  label: "network.online",
  Icon: IconWifi,
  iconColor: undefined,
};

const offlineConfig: IndicatorConfig = {
  label: "network.offline",
  Icon: IconWifiOff,
  iconColor: "var(--mantine-color-red-8)",
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
