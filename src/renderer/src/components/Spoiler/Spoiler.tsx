import { Spoiler as MantineSpoiler, SpoilerProps as MantineSpoilerProps } from "@mantine/core";
import { useTranslation } from "react-i18next";

export const Spoiler = (props: Omit<MantineSpoilerProps, "hideLabel" | "showLabel">) => {
  const { t } = useTranslation();
  return <MantineSpoiler hideLabel={t("hide")} showLabel={t("showMore")} {...props} />;
};
