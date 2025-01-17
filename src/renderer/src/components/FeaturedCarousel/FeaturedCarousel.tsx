import { GameStoreModel } from "@contracts/database/games";
import { AspectRatio, BackgroundImage, Badge, Card, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useHover, useInterval } from "@mantine/hooks";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

import classes from "./FeaturedCarousel.module.css";

type Props = {
  game: GameStoreModel;
};

export const FeaturedCarousel = ({ game }: Props) => {
  const { t } = useTranslation();

  if (!game.screenshots?.length) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const screenshots = game.screenshots.slice(0, 3);
  const { hovered, ref } = useHover();

  const interval = useInterval(() => {
    setCurrentIndex((current) => (current + 1) % screenshots.length);
  }, 2000);

  useEffect(() => {
    if (hovered) {
      interval.stop();
    } else {
      interval.start();
    }
    return interval.stop;
  }, [hovered]);

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    interval.stop();
    interval.start();
  };

  return (
    <Card className={classes.container}>
      <Grid grow gutter="xs">
        <Grid.Col span={5}>
          <AspectRatio ratio={3 / 2}>
            <div className={classes.mainImageContainer} ref={ref}>
              {screenshots.map((screenshot, index) => (
                <BackgroundImage
                  className={`${classes.mainImage} ${index === currentIndex ? classes.visible : ""}`}
                  key={screenshot}
                  src={screenshot}
                />
              ))}
            </div>
          </AspectRatio>
        </Grid.Col>
        <Grid.Col span={1}>
          <Stack className={classes.sideImagesContainer} justify="space-between">
            {screenshots.map((screenshot, index) => (
              <BackgroundImage
                className={classes.sideImage}
                key={screenshot}
                onClick={() => handleImageClick(index)}
                src={screenshot}
              />
            ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack align="flex-start" gap={0} h="100%" justify="flex-start" p="sm">
            <Title mb="sm" order={2}>
              {game.name}
            </Title>
            <Group gap="xs" mb="md">
              {game.genres?.map((genre) => (
                <Badge color="cyan" key={genre.id} radius="md" size="md" variant="light">
                  {genre.name}
                </Badge>
              ))}
            </Group>
            <Text lineClamp={4} mb="sm">
              {game.summary}
            </Text>
            <NavLink to={`/desktop/games/${game._id}`}>{t("featuredGame.viewDetails")}</NavLink>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
