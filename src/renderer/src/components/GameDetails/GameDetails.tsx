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
import { IconArrowLeft, IconPencil, IconTrash } from "@tabler/icons-react";
import { t } from "i18next";
import classes from "./GameDetails.module.css";
import { useEffect, useRef } from "react";
import { GameStoreModel } from "@database/schema/games";
import { BackToTop } from "@components/BackToTop/BackToTop";
import { LibraryIcon } from "@components/LibraryIcon/LibraryIcon";
import { RawHtml } from "@components/RawHtml/RawHtml";

type GameDetailsProps = {
  game?: GameStoreModel;
  onBack: () => void;
};

export const GameDetails = ({ game, onBack }: GameDetailsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!game) {
    onBack();
    return;
  }

  const scrollToTop = () => containerRef.current!.scrollTo({ top: 0 });

  useEffect(() => scrollToTop(), [game.id]);

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
          <ActionIcon variant="default" size="lg" aria-label={t("goBack")} onClick={() => console.log("edit")}>
            <VisuallyHidden>{t("goBack")}</VisuallyHidden>
            <IconPencil style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="default" size="lg" aria-label={t("goBack")} onClick={() => console.log("delete")}>
            <VisuallyHidden>{t("goBack")}</VisuallyHidden>
            <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Flex>
      <Divider mt="md" />
      <ScrollArea className={classes.body} viewportRef={containerRef}>
        <BackToTop container={containerRef.current} />
        <BackgroundImage className={classes.hero} src={game.backgroundImage || ""}>
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
        <Box>
          <RawHtml html={game.description} />
        </Box>
      </ScrollArea>
    </Flex>
  );
};
