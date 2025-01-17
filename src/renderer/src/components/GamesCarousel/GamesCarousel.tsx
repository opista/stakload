import { Carousel } from "@mantine/carousel";
import { Stack, Title } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { ReactNode } from "react";

import classes from "./GamesCarousel.module.css";

type GamesCarouselProps = {
  children: ReactNode;
  slideCount: number;
  title: string;
};

export const GamesCarousel = ({ children, slideCount, title }: GamesCarouselProps) => {
  return (
    <Stack>
      <Title order={2}>{title}</Title>
      <Carousel
        align="start"
        classNames={{
          controls: classes.controls,
          control: classes.control,
        }}
        controlSize={26}
        controlsOffset="xs"
        key={slideCount}
        nextControlIcon={<IconArrowRight size={20} stroke={2} />}
        previousControlIcon={<IconArrowLeft size={20} stroke={2} />}
        slideGap="md"
        slideSize={`${90 / slideCount}%`}
        slidesToScroll={slideCount}
      >
        {children}
      </Carousel>
    </Stack>
  );
};
