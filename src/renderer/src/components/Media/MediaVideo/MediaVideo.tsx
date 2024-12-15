import { AspectRatio, BackgroundImage, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import classes from "./MediaVideo.module.css";

const getThumbnailUrl = (watchId: string) => `https://img.youtube.com/vi/${watchId}/hqdefault.jpg`;

const getEmbedUrl = (watchId: string) => `https://www.youtube.com/embed/${watchId}?autoplay=1`;

type MediaVideoProps = {
  id: string;
};

export const MediaVideo = ({ id }: MediaVideoProps) => {
  const { t } = useTranslation();

  if (!id) return;

  const thumbnailSrc = getThumbnailUrl(id);
  const embedSrc = getEmbedUrl(id);

  return (
    <UnstyledButton
      className={classes.button}
      onClick={() =>
        modals.open({
          centered: true,
          children: (
            <AspectRatio ratio={16 / 9}>
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={classes.iframe}
                src={embedSrc}
              />
            </AspectRatio>
          ),
          size: "xl",
          title: t("media"),
        })
      }
    >
      <div className={classes.playButton}>
        <IconPlayerPlayFilled className={classes.playIcon} color="white" height="50%" width="50%" />
      </div>
      <BackgroundImage className={classes.backgroundImage} src={thumbnailSrc} />
    </UnstyledButton>
  );
};
