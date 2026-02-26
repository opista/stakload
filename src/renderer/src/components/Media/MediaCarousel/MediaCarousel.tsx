import { Carousel } from "@components/Carousel/Carousel";

import { MediaImage } from "../MediaImage/MediaImage";
import { MediaVideo } from "../MediaVideo/MediaVideo";

type MediaCarouselProps = {
  height?: string | number;
  images?: string[];
  videos?: string[];
};

export const MediaCarousel = ({ images = [], videos = [] }: MediaCarouselProps) => {
  const imageSlides = images?.map((image) => <MediaImage key={image} src={image} />);

  const videoSlides = videos?.map((video) => <MediaVideo key={video} id={video} />);

  const slides = [...imageSlides, ...videoSlides];

  if (!slides.length) return null;

  return (
    <Carousel
      className="rounded-[2.5rem] overflow-hidden"
      slideClassName="w-full"
      options={{ align: "start", loop: true }}
      autoplay
      withControls={slides.length > 1}
    >
      {slides}
    </Carousel>
  );
};
