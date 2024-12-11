import { Carousel } from "@mantine/carousel";
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";

import { MediaImage } from "../MediaImage/MediaImage";
import { MediaVideo } from "../MediaVideo/MediaVideo";
import classes from "./MediaCarousel.module.css";

type MediaCarouselProps = {
  height?: number;
  images?: string[];
  videos?: string[];
};

export const MediaCarousel = ({ height = 300, images = [], videos = [] }: MediaCarouselProps) => {
  const imageSlides = images?.map((image) => (
    <Carousel.Slide key={image}>
      <MediaImage src={image} />
    </Carousel.Slide>
  ));

  const videoSlides = videos?.map((video) => (
    <Carousel.Slide key={video}>
      <MediaVideo id={video} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      classNames={{
        control: classes.control,
        controls: classes.controls,
        indicator: classes.indicator,
        indicators: classes.indicators,
        root: classes.root,
      }}
      controlsOffset={0}
      draggable
      height={height}
      includeGapInSize
      loop
      nextControlIcon={<IconCaretRightFilled />}
      previousControlIcon={<IconCaretLeftFilled />}
      slideGap={0}
      slideSize="100%"
      withControls
      withIndicators
      withKeyboardEvents
    >
      {[...imageSlides, ...videoSlides]}
    </Carousel>
  );
};
