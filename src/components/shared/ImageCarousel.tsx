"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcn-ui/Carousel";
import { cn } from "@/lib";

interface ImageCarouselProps {
  children: React.ReactNode;
}

export function ImageCarousel({ children }: ImageCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 30000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="max-w-[1380px] m-auto w-full">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className=""
        onMouseEnter={() => plugin.current?.stop()}
        onMouseLeave={() => plugin.current?.play()}
      >
        <CarouselContent>
          {React.Children.map(children, (child, index) => (
            <CarouselItem key={index}>{child}</CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-0 h-full rounded-none w-12 border-0 bg-inherit hover:bg-slate-200" />
        <CarouselNext className="hidden md:flex right-0 h-full rounded-none w-12 border-0 bg-inherit hover:bg-slate-200" />
      </Carousel>
      <div className="flex gap-1 py-2 w-full justify-center items-center">
        {Array.from({ length: count }).map((_, index: number) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 bg-slate-400 rounded-full",
              current === index + 1 ? "bg-slate-600" : "bg-slate-400"
            )}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
