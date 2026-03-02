import { Carousel } from "./carousel";
import { MediaImage } from "./media-image";
import { MediaVideo } from "./media-video";

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
      className="overflow-hidden rounded-[2.5rem]"
      slideClassName="w-full"
      options={{ align: "start", loop: true }}
      autoplay
      withControls={slides.length > 1}
    >
      {slides}
    </Carousel>
  );
};
