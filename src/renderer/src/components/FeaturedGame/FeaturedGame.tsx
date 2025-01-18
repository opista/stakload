import { GameStoreModel } from "@contracts/database/games";
import { AspectRatio, BackgroundImage, Badge, Card, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useHover, useInterval, useInViewport } from "@mantine/hooks";
import clsx from "clsx";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

import classes from "./FeaturedGame.module.css";

type FeaturedGameProps = {
  game: GameStoreModel;
};

export const FeaturedGame = ({ game }: FeaturedGameProps) => {
  const { t } = useTranslation();
  const hasScreenshots = !!game.screenshots?.length;
  const screenshots = hasScreenshots ? game.screenshots!.slice(0, 3) : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const { hovered, ref: hoverRef } = useHover();
  const { ref: inViewportRef, inViewport } = useInViewport();

  const interval = useInterval(() => {
    setCurrentIndex((current) => (current + 1) % screenshots.length);
  }, 10000);

  useEffect(() => {
    if (!hasScreenshots || hovered || !inViewport) {
      interval.stop();
    } else {
      interval.start();
    }
    return interval.stop;
  }, [hovered, inViewport, hasScreenshots]);

  const handleImageClick = (index: number) => {
    if (!hasScreenshots) return;
    setCurrentIndex(index);
    interval.stop();
    interval.start();
  };

  return (
    <Card className={classes.container}>
      <Grid grow gutter="xs">
        <Grid.Col span={5}>
          <AspectRatio ratio={3 / 2}>
            <div className={classes.mainImageContainer} ref={hoverRef}>
              {hasScreenshots ? (
                screenshots.map((screenshot, index) => (
                  <BackgroundImage
                    className={clsx(classes.mainImage, { [classes.visible]: index === currentIndex })}
                    key={screenshot}
                    src={screenshot}
                  />
                ))
              ) : (
                <div className={clsx(classes.mainImage, classes.placeholder)} />
              )}
            </div>
          </AspectRatio>
        </Grid.Col>
        <Grid.Col ref={inViewportRef} span={1}>
          <Stack className={classes.sideImagesContainer} justify="space-between">
            {hasScreenshots
              ? screenshots.map((screenshot, index) => (
                  <BackgroundImage
                    className={classes.sideImage}
                    key={screenshot}
                    onClick={() => handleImageClick(index)}
                    src={screenshot}
                  />
                ))
              : Array(3)
                  .fill(null)
                  .map((_, index) => <div className={clsx(classes.sideImage, classes.placeholder)} key={index} />)}
          </Stack>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack align="flex-start" gap={0} h="100%" justify="flex-start" p="sm">
            <Title lineClamp={1} mb="sm" order={2}>
              {game.name}
            </Title>
            <Group gap="xs" mb="md">
              {game.genres?.map((genre) => (
                <Badge color="cyan" key={genre.id} radius="md" size="md" variant="light">
                  {genre.name}
                </Badge>
              ))}
            </Group>
            <Text lineClamp={3} mb="sm">
              {game.summary}
            </Text>
            <NavLink to={`/desktop/games/${game._id}`}>{t("featuredGame.viewDetails")}</NavLink>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
