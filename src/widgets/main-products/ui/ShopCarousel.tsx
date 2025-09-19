"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductCategories } from "./ProductCategories";
import { GoToButton } from "@/shared/ui";
import { CategoryWithProducts } from "@/entities/category/model";
import { ProductGroupList } from "./ProductGroupList";
import { LINKS } from "@/shared/model";

interface Props {
  categoriesWithProducts: CategoryWithProducts[];
}

export function ShopCarousel({ categoriesWithProducts }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    align: "start",
    dragFree: false
  });
  const [current, setCurrent] = useState(0);

  // Обновление текущего индекса при свайпе
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Клик из ProductCategories
  const handleCategoryClick = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <>
      <ProductCategories
        categories={categoriesWithProducts}
        current={current}
        handleCategoryClick={handleCategoryClick}
      />

      <div className="max-w-[1380px] m-auto w-full">
        {/* Embla viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          {/* Embla container */}
          <div className="flex">
            {categoriesWithProducts.map(
              ({ id, name, slug, products }: CategoryWithProducts, index) => (
                // Каждый слайд занимает 100% ширины viewport
                <div key={id} className="flex-[0_0_100%]">
                  <ProductGroupList products={products} />
                  <GoToButton
                    href={`${LINKS.CATALOG}/${slug}`}
                    label={`Открыть ${name.toLowerCase()} в каталоге`}
                    className="mx-auto select-none"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
