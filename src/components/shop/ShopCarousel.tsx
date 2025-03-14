"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/shadcn-ui/Carousel";
import { ProductCategories } from "./ProductCategories";
import { GoToButton } from "./ui";
import { CategoryWithProducts } from "@/types";
import { ProductGroupList } from "./ProductGroupList";
import { LINKS } from "@/constants";

interface Props {
  categories: CategoryWithProducts[];
}

export function ShopCarousel({ categories }: Props) {
  const [api, setApi] = useState<any>();
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
        categories={categories}
        current={current}
        handleCategoryClick={handleCategoryClick}
      />
      <Carousel setApi={setApi}>
        <CarouselContent>
          {categories.map(
            ({ id, name, slug, products }: CategoryWithProducts) => (
              <CarouselItem key={id}>
                <ProductGroupList products={products} />
                <GoToButton
                  href={`${LINKS.CATALOG}/${slug}`}
                  label={`Открыть ${name.toLowerCase()} в каталоге`}
                  className="mx-auto"
                />
              </CarouselItem>
            )
          )}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
