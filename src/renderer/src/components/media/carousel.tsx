import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Children, ReactNode, useCallback, useEffect, useState } from "react";

type CarouselProps = {
  children: ReactNode;
  className?: string;
  slideClassName?: string;
  options?: EmblaOptionsType;
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

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const bothButtonsDisabled = prevBtnDisabled && nextBtnDisabled;

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative group/carousel", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {Children.map(children, (child) => (
            <div className={cn("flex-none min-w-0", slideClassName)}>{child}</div>
          ))}
        </div>
      </div>

      {withControls && !bothButtonsDisabled && (
        <div className="absolute bottom-full mb-6 right-0 flex gap-2">
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className={cn(
              "w-8 h-8 rounded border border-white/5 flex items-center justify-center text-slate-500 transition-all focus:outline-none",
              prevBtnDisabled ? "opacity-50 cursor-not-allowed" : "hover:text-primary hover:border-primary/50",
            )}
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className={cn(
              "w-8 h-8 rounded border border-white/5 flex items-center justify-center text-slate-500 transition-all focus:outline-none",
              nextBtnDisabled ? "opacity-50 cursor-not-allowed" : "hover:text-primary hover:border-primary/50",
            )}
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
