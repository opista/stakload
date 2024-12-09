import { IncompatibilityIcon } from "@components/IncompatibilityIcon/IncompatibilityIcon";
import { LibraryIcon } from "@components/LibraryIcon/LibraryIcon";
import { GameStoreModel } from "@contracts/database/games";
import { BackgroundImage, Container, Flex, Group, Overlay, Title } from "@mantine/core";
import { getHighestRatioMedia } from "@util/get-highest-ratio-media";
import { rgbToHsl } from "@util/rgb-to-hsl";
import Vibrant from "node-vibrant";
import { useEffect } from "react";

import classes from "./GameHero.module.css";

type GameHeroProps = {
  game: GameStoreModel;
};

export const GameHero = ({ game }: GameHeroProps) => {
  const media = getHighestRatioMedia(game?.artworks);
  const headerImage = media?.url || game?.screenshots?.[0];

  useEffect(() => {
    if (!headerImage) return;

    const v = new Vibrant(headerImage);
    v.getPalette()
      .then((r) => {
        const rgb = r.DarkMuted?.getRgb();
        if (!rgb) return;
        const color = rgbToHsl(...rgb);
        const formatted = `hsl(${color})`;
        document.body.style.setProperty("--gradient-color", formatted);
      })
      .catch(() => {});

    return () => {
      document.body.style.setProperty("--gradient-color", "transparent");
    };
  }, [headerImage]);

  return (
    <BackgroundImage className={classes.hero} src={headerImage || ""}>
      <Overlay
        className={classes.overlay}
        gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 50%)"
      />
      <Container size="responsive">
        <Flex className={classes.content}>
          <Title className={classes.title} lineClamp={3} order={1} title={game.name} textWrap="balance">
            {game.name}
          </Title>
          <Group gap="xs">
            {/* TODO - Only show this icon if game isn't supported on system */}
            <IncompatibilityIcon color="orange" size="xl" />
            <LibraryIcon game={game} size="xl" />
          </Group>
        </Flex>
      </Container>
    </BackgroundImage>
  );
};
