import { BackgroundImage, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useTranslation } from "react-i18next";

import classes from "./MediaImage.module.css";

export type MediaImageProps = {
  src: string;
};

export const MediaImage = ({ src }: MediaImageProps) => {
  const { t } = useTranslation();

  return (
    <UnstyledButton
      className={classes.button}
      onClick={() =>
        modals.open({
          centered: true,
          children: <img className={classes.backgroundImage} src={src} />,
          size: "auto",
          title: t("mediaImage.title"),
        })
      }
    >
      <BackgroundImage className={classes.backgroundImage} src={src} />
    </UnstyledButton>
  );
};
