import { BackgroundImage, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";

import classes from "./MediaImage.module.css";

export type MediaImageProps = {
  src: string;
};

export const MediaImage = ({ src }: MediaImageProps) => (
  <UnstyledButton
    className={classes.button}
    onClick={() =>
      modals.open({
        centered: true,
        children: <img className={classes.backgroundImage} src={src} />,
        size: "auto",
        // TODO
        title: "Media",
      })
    }
  >
    <BackgroundImage className={classes.backgroundImage} src={src} />
  </UnstyledButton>
);
