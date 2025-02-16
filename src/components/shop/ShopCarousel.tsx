"use client";

import { useState, useEffect } from "react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/shadcn-ui/Carousel";
import { ProductCategories } from "./ProductCategories";
import { CategoryWithProducts } from "./types";
import { ProductGroupList } from "./ProductGroupList";

interface Props {
  cats: CategoryWithProducts[];
}

export function ShopCarousel({ cats }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleCategoryClick = (index: number) => {
    if (api) api.scrollTo(index);
  };

  return (
    <div className="max-w-[1380px] m-auto w-full">
      <ProductCategories
        cats={cats}
        count={count}
        current={current}
        handleCategoryClick={handleCategoryClick}
      />
      <Carousel setApi={setApi}>
        <CarouselContent>
          {cats.map((category, index) => (
            <CarouselItem key={category.id}>
              <ProductGroupList category={category} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
