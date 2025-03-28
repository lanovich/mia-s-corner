"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { cn } from "@/lib";

interface Props {
  className?: string;
  images: Image[];
}

export const ProductGallery: React.FC<Props> = ({ images, className }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setCursorPosition({ x, y });
  };

  return (
    <div className={cn("flex gap-4 items-center h-[500px]", className)}>
      {/* Миниатюры (вертикальные) */}
      <div className="h-[480px] hidden md:flex">
        <Swiper
          direction="vertical"
          spaceBetween={8}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress
          onSwiper={setThumbsSwiper}
          className="w-[70px] h-[500px]"
        >
          {images.map(({ type, url }, index) => (
            <SwiperSlide
              key={index}
              className="cursor-pointer !h-[calc(25%-6px)]"
            >
              <div className="relative w-full h-full">
                <Image
                  src={url ?? "/placeholder.jpg"}
                  fill
                  alt={`Thumbnail ${type}`}
                  className="rounded-md object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Основной слайдер */}
      <Swiper
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        spaceBetween={8}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-[400px] h-[500px] flex-1"
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {images.map(({ type, url }, index) => (
          <SwiperSlide
            key={index}
            className="!flex items-center justify-center"
            onMouseEnter={() => {
              if (window.innerWidth >= 768) setIsHovered(true);
            }}
            onMouseLeave={() => {
              if (window.innerWidth >= 768) setIsHovered(false);
            }}
            onMouseMove={(e) => {
              if (window.innerWidth >= 768) handleMouseMove(e);
            }}
          >
            <div className="rounded-lg overflow-hidden w-full h-full relative">
              <Image
                src={url}
                fill
                alt={`Product image ${index}`}
                className="object-cover rounded-lg transition-transform duration-300"
                style={{
                  transform:
                    isHovered &&
                    window.innerWidth >= 768 &&
                    activeIndex === index
                      ? "scale(1.5)"
                      : "scale(1)",
                  transformOrigin: `${cursorPosition.x}% ${cursorPosition.y}%`,
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
