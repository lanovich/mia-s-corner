"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductCategories } from "./ProductCategories";
import { GoToButton } from "@/shared/ui";
import { ProductGroupList } from "./ProductGroupList";
import { LINKS } from "@/shared/model";
import { GroupedShortProducts } from "@/entities/product/model";

interface Props {
  groupedProducts: GroupedShortProducts[];
}

export function ShopCarousel({ groupedProducts }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    align: "start",
    dragFree: false,
  });
  const [current, setCurrent] = useState(0);

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

  const handleCategoryClick = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <>
      <ProductCategories
        categories={groupedProducts.map((g) => g.categoryInfo)}
        current={current}
        handleCategoryClick={handleCategoryClick}
      />

      <div className="max-w-[1380px] m-auto w-full">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {groupedProducts.map(({ categoryInfo, products }) => (
              <div key={categoryInfo.id} className="flex-[0_0_100%]">
                <ProductGroupList products={products} />
                <GoToButton
                  href={`${LINKS.CATALOG}/${categoryInfo?.slug}`}
                  label={`Открыть ${categoryInfo.name.toLowerCase()} в каталоге`}
                  className="mx-auto select-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
