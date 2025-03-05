"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface Props {
  className?: string;
  images: Image[];
}

export const ProductGallery: React.FC<Props> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="flex gap-4 items-center h-[500px]">
      {/* Обертка для вертикального слайдера, чтобы он центрировался */}
      <div className="h-[480px] hidden md:flex">
        <Swiper
          direction="vertical"
          spaceBetween={5}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress
          onSwiper={setThumbsSwiper}
          className="w-[70px] h-[500px]"
        >
          {images.map(({ type, url }, index) => (
            <SwiperSlide key={index} className="cursor-pointer">
              <Image
                src={url}
                width={70}
                height={70}
                alt={`Thumbnail ${type}`}
                className="rounded-md object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Основное изображение */}
      <Swiper
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-[400px] h-[500px] flex-1"
      >
        {images.map(({ type, url }, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-lg overflow-hidden w-[400px] h-[500px]">
              <Image
                src={url}
                fill
                alt={`Product image ${index}`}
                className="object-cover rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
