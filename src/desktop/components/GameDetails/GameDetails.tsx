import {
  ActionIcon,
  BackgroundImage,
  Box,
  Divider,
  Flex,
  Group,
  Overlay,
  ScrollArea,
  Text,
  VisuallyHidden,
} from "@mantine/core";
import { GameStoreModel } from "../../../database/schema/game.schema";
import { IconArrowLeft, IconPencil, IconTrash } from "@tabler/icons-react";
import { t } from "i18next";
import classes from "./GameDetails.module.css";
import { LibraryIcon } from "../../../components/LibraryIcon/LibraryIcon";
import { useEffect, useRef } from "react";
import { BackToTop } from "../BackToTop/BackToTop";

type GameDetailsProps = {
  game?: GameStoreModel;
  onBack: () => void;
};

export const GameDetails = ({ game, onBack }: GameDetailsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // TODO
  if (!game) {
    return <>no game found info</>;
  }

  const scrollToTop = () => containerRef.current!.scrollTo({ top: 0 });

  useEffect(() => scrollToTop(), [game._id]);

  return (
    <Flex className={classes.container}>
      <Flex justify="space-between">
        <Group>
          <ActionIcon variant="default" size="lg" aria-label={t("goBack")} onClick={onBack}>
            <VisuallyHidden>{t("goBack")}</VisuallyHidden>
            <IconArrowLeft style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Group>
        <Group gap="xs">
          <ActionIcon
            variant="default"
            size="lg"
            aria-label={t("goBack")}
            onClick={() => console.log("edit")}
          >
            <VisuallyHidden>{t("goBack")}</VisuallyHidden>
            <IconPencil style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="default"
            size="lg"
            aria-label={t("goBack")}
            onClick={() => console.log("delete")}
          >
            <VisuallyHidden>{t("goBack")}</VisuallyHidden>
            <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Flex>
      <Divider mt="md" />
      <ScrollArea className={classes.body} viewportRef={containerRef}>
        <BackToTop container={containerRef.current} />
        <BackgroundImage
          className={classes.hero}
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
        >
          <Flex className={classes.heroContent}>
            <Text className={classes.heroText} lineClamp={3} title={game.name}>
              {game.name}
            </Text>
            <Group>
              <LibraryIcon game={game} size="xl" />
            </Group>
          </Flex>

          <Overlay
            className={classes.overlay}
            gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 50%)"
            opacity={0.85}
          />
        </BackgroundImage>
        <Box h={7000} />
      </ScrollArea>
    </Flex>
  );
};
