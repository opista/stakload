import { Carousel } from "@mantine/carousel";
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import { MediaImage } from "../MediaImage/MediaImage";
import { MediaVideo } from "../MediaVideo/MediaVideo";

import classes from "./MediaCarousel.module.css";

type MediaCarouselProps = {
  height?: string | number;
  images?: string[];
  videos?: string[];
};

export const MediaCarousel = ({ height = 300, images = [], videos = [] }: MediaCarouselProps) => {
  const autoplay = useRef(Autoplay({ delay: 5000 }));

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

  const slides = [...imageSlides, ...videoSlides];

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
      nextControlIcon={<IconCaretRightFilled size="70%" />}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      plugins={[autoplay.current]}
      previousControlIcon={<IconCaretLeftFilled size="70%" />}
      slideGap={0}
      slideSize="100%"
      withControls={!!slides.length}
      withIndicators
      withKeyboardEvents
    >
      {slides}
    </Carousel>
  );
};
