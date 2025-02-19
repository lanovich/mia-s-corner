"use client";

import { useState, useEffect } from "react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/shadcn-ui/Carousel";
import { ProductCategories } from "./ProductCategories";
import { CategoryWithProducts } from "@/types";
import { ProductGroupList } from "./ProductGroupList";
import { GoToCatalogButton } from "./ui";

interface Props {
  categoriesWithProducts: CategoryWithProducts[];
}

export function ShopCarousel({ categoriesWithProducts }: Props) {
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
        categoriesWithProducts={categoriesWithProducts}
        count={count}
        current={current}
        handleCategoryClick={handleCategoryClick}
      />
      <Carousel setApi={setApi}>
        <CarouselContent>
          {categoriesWithProducts.map((category) => (
            <CarouselItem key={category.id}>
              <ProductGroupList category={category} />
              <GoToCatalogButton category={category} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
