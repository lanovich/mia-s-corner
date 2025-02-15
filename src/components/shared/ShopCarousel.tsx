"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/Carousel";
import { cn } from "@/libs";
import { ProductCategories } from ".";

interface ImageCarouselProps {
  children: React.ReactNode;
  cats: any[]
}

export function ShopCarousel({ children, cats }: ImageCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

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

  const handleCategoryClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="max-w-[1380px] m-auto w-full">
      <ProductCategories cats={cats} count={count} current={current} handleCategoryClick={handleCategoryClick}/>
      <Carousel
        setApi={setApi}
        className=""
      >
        <CarouselContent>
          {React.Children.map(children, (child, index) => (
            <CarouselItem key={index}>{child}</CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
