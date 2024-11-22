import { BackgroundImage, Box, Divider, Flex, Group, Overlay, ScrollArea, Title } from "@mantine/core";
import { IconArrowLeft, IconPencil, IconTrash } from "@tabler/icons-react";
import classes from "./GameDetails.module.css";
import { useEffect, useRef } from "react";
import { BackToTop } from "@components/BackToTop/BackToTop";
import { LibraryIcon } from "@components/LibraryIcon/LibraryIcon";
import { RawHtml } from "@components/RawHtml/RawHtml";
import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { useTranslation } from "react-i18next";
import { GameStoreModel } from "../../schema/games";

type GameDetailsProps = {
  game?: GameStoreModel;
  onBack: () => void;
};

export const GameDetails = ({ game, onBack }: GameDetailsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  if (!game) {
    onBack();
    return;
  }

  const scrollToTop = () => containerRef.current!.scrollTo({ top: 0 });

  useEffect(() => scrollToTop(), [game._id]);

  return (
    <Flex className={classes.container}>
      <Flex justify="space-between">
        <Group>
          <ActionIcon aria-label={t("goBack")} icon={IconArrowLeft} onClick={onBack} />
        </Group>
        <Group gap="xs">
          <ActionIcon aria-label={t("edit")} icon={IconPencil} onClick={() => console.log("edit")} />
          <ActionIcon aria-label={t("delete")} icon={IconTrash} onClick={() => console.log("delete")} />
        </Group>
      </Flex>
      <Divider mt="md" />
      <ScrollArea className={classes.body} viewportRef={containerRef}>
        <BackToTop container={containerRef.current} />
        <BackgroundImage className={classes.hero} src={game.backgroundImage || ""}>
          <Flex className={classes.heroContent}>
            <Title className={classes.heroText} lineClamp={3} order={1} title={game.name} textWrap="balance">
              {game.name}
            </Title>
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
