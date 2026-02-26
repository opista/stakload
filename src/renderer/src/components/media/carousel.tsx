import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Children, ReactNode, useCallback, useEffect, useRef, useState } from "react";

type CarouselProps = {
  children: ReactNode;
  className?: string;
  slideClassName?: string;
  options?: EmblaOptionsType;
  autoplay?: boolean;
  withControls?: boolean;
  onSlideChange?: (index: number) => void;
  contentClassName?: string;
};

type ControlButtonProps = {
  onClick: () => void;
  disabled: boolean;
  icon: React.ComponentType<{ size: number }>;
};

const ControlButton = ({ disabled, icon: Icon, onClick }: ControlButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "w-8 h-8 rounded border border-white/5 flex items-center justify-center bg-zinc-950 text-slate-500 transition-all focus:outline-none",
      disabled ? "opacity-50 cursor-not-allowed" : "hover:text-primary hover:border-primary/50",
    )}
  >
    <Icon size={20} />
  </button>
);

export const Carousel = ({
  autoplay = false,
  children,
  className,
  contentClassName,
  onSlideChange,
  options = {},
  slideClassName,
  withControls = true,
}: CarouselProps) => {
  const mergedOptions: EmblaOptionsType = {
    align: "start",
    duration: 20,
    loop: false,
    watchFocus: false,
    ...options,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(mergedOptions, autoplay ? [Autoplay()] : []);

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const bothButtonsDisabled = prevBtnDisabled && nextBtnDisabled;

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    isFocusDriven.current = false;
    if (emblaApi) emblaApi.scrollNext();
  };

  const isFocusDriven = useRef(false);

  const onSelect = useCallback(
    (emblaApi: EmblaCarouselType) => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());

      if (isFocusDriven.current) {
        // Scroll triggered by focus. Keep the explicitly focused index active.
      } else {
        // Scroll triggered by drag/buttons. Update active index to the snap point.
        onSlideChange?.(emblaApi.selectedScrollSnap());
      }
    },
    [onSlideChange],
  );

  const [focusedIndex, setFocusedIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!emblaApi) return;

    if (e.key === "ArrowLeft") {
      const prevIndex = focusedIndex - 1;
      if (prevIndex >= 0) {
        e.preventDefault();
        slideRefs.current[prevIndex]?.focus({ preventScroll: true });
      }
    } else if (e.key === "ArrowRight") {
      const nextIndex = focusedIndex + 1;
      if (nextIndex < Children.count(children)) {
        e.preventDefault();
        slideRefs.current[nextIndex]?.focus({ preventScroll: true });
      }
    }
  };

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative group/carousel", className)} onKeyDown={onKeyDown} tabIndex={-1}>
      <div className="overflow-visible" ref={emblaRef}>
        <div className={cn("flex gap-4", contentClassName)}>
          {Children.map(children, (child, index) => (
            <div
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              tabIndex={-1}
              className={cn("flex-none min-w-0 focus:outline-none", slideClassName)}
              onFocus={(e) => {
                setFocusedIndex(index);
                onSlideChange?.(index); // Explicitly notify parent of focus

                if (!emblaApi) return;
                // embla handles its own focus scrolling smoothly
                // but we need to tell it to scroll to the index
                // and skip the browser's instant jump
                if (emblaApi.selectedScrollSnap() !== index) {
                  isFocusDriven.current = true;
                  emblaApi.scrollTo(index);
                  // Reset flag immediately after Embla's synchronous select event
                  setTimeout(() => {
                    isFocusDriven.current = false;
                  }, 0);
                }
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {withControls && !bothButtonsDisabled && (
        <div className="absolute bottom-full mb-6 right-12 flex gap-2">
          <ControlButton onClick={scrollPrev} disabled={prevBtnDisabled} icon={IconChevronLeft} />
          <ControlButton onClick={scrollNext} disabled={nextBtnDisabled} icon={IconChevronRight} />
        </div>
      )}
    </div>
  );
};
