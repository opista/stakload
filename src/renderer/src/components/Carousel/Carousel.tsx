import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@util/cn";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React, { ReactNode, useCallback } from "react";

type CarouselProps = {
  children: ReactNode;
  className?: string;
  slideClassName?: string;
  options?: any;
  autoplay?: boolean;
  withControls?: boolean;
};

export const Carousel = ({
  autoplay = false,
  children,
  className,
  options = { align: "start", loop: false },
  slideClassName,
  withControls = true,
}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, autoplay ? [Autoplay()] : []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className={cn("relative group", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {React.Children.map(children, (child) => (
            <div className={cn("flex-[0_0_auto] min-w-0 pr-4", slideClassName)}>{child}</div>
          ))}
        </div>
      </div>

      {withControls && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100 focus:outline-none"
          >
            <IconChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100 focus:outline-none"
          >
            <IconChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};
