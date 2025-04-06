"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { ProductCategories } from "./ProductCategories";
import { GoToButton } from "./ui";
import { CategoryWithProducts } from "@/types";
import { ProductGroupList } from "./ProductGroupList";
import { LINKS } from "@/constants";

interface Props {
  categoriesWithProducts: CategoryWithProducts[];
}

export function ShopCarousel({ categoriesWithProducts }: Props) {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  const handleCategoryClick = (index: number) => {
    if (swiperInstance) swiperInstance.slideTo(index);
  };

  return (
    <div className="max-w-[1380px] m-auto w-full">
      <ProductCategories
        categories={categoriesWithProducts}
        current={current}
        handleCategoryClick={handleCategoryClick}
      />
      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
      >
        {categoriesWithProducts.map(
          ({ id, name, slug, products }: CategoryWithProducts) => (
            <SwiperSlide key={id}>
              <ProductGroupList products={products} />
              <GoToButton
                href={`${LINKS.CATALOG}/${slug}`}
                label={`Открыть ${name.toLowerCase()} в каталоге`}
                className="mx-auto select-none"
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
}
