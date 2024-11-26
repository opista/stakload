import { Text, Title } from "@mantine/core";
import clsx from "clsx";
import classes from "./SettingsTitle.module.css";
import { ReactNode } from "react";

type SettingsTitleProps = {
  title: string;
  subtitle?: ReactNode;
};

export const SettingsTitle = ({ title, subtitle }: SettingsTitleProps) => {
  return (
    <>
      <Title className={clsx({ [classes.bottomMargin]: !subtitle })} order={2} size="h3">
        {title}
      </Title>
      {subtitle && (
        <Text c="dimmed" className={classes.bottomMargin} size="xs">
          {subtitle}
        </Text>
      )}
    </>
  );
};
