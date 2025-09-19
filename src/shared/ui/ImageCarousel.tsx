"use client";

import useEmblaCarousel from "embla-carousel-react";
import { cn, useEmblaAutoplay } from "@/shared/lib";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useCallback, useEffect, useState } from "react";

interface ImageCarouselProps {
  children: React.ReactNode;
}

const AUTO_SWIPE_DELAY = 6000;

export function ImageCarousel({ children }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentSlide, setCurrentSlide] = useState(0);
  const { pause, resume } = useEmblaAutoplay({
    emblaApi,
    delay: AUTO_SWIPE_DELAY,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <div className="max-w-[1380px] mx-auto w-full relative">
      {/* Основной слайдер */}
      <div
        ref={emblaRef}
        className="overflow-hidden relative"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className="flex">
          {Children.map(children, (child, index) => (
            <div className="flex-[0_0_100%]" key={index}>
              {child}
            </div>
          ))}
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 hidden transition-all duration-150 md:flex h-full w-12 items-center justify-center bg-inherit hover:bg-white/30 z-10"
        >
          <ChevronLeft color="black" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden transition-all duration-150 md:flex h-full w-12 items-center justify-center bg-inherit hover:bg-white/30 z-10"
        >
          <ChevronRight color="black" />
        </button>
      </div>

      <div className="flex gap-2 py-4 justify-center">
        {Children.map(children, (_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 bg-slate-400 rounded-full",
              currentSlide === index && "bg-slate-600"
            )}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
