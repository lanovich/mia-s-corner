"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import { cn } from "@/shared/lib";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  children: React.ReactNode;
}

const AUTO_SWIPE_DELAY = 6000;

export function ImageCarousel({ children }: ImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<any>(null);

  const handleDotClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div className="max-w-[1380px] mx-auto w-full">
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: AUTO_SWIPE_DELAY,
          disableOnInteraction: true,
        }}
        navigation={{
          nextEl: ".main-swiper-button-next",
          prevEl: ".main-swiper-button-prev",
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.activeIndex);
        }}
        className="relative"
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}

        {/* Кастомные кнопки навигации */}
        <div
          className="absolute main-swiper-button-prev hidden md:flex left-0 h-full rounded-none w-12 border-0 bg-inherit hover:bg-slate-200"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
        >
          <ChevronLeft color="white" className="mr-1" />
        </div>
        <div
          className="absolute main-swiper-button-next hidden md:flex right-0 h-full rounded-none w-12 border-0 bg-inherit hover:bg-slate-200"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
        >
          <ChevronRight color="white" className="ml-1" />
        </div>
      </Swiper>

      {/* Точки навигации */}
      <div className="flex gap-2 py-4 justify-center">
        {React.Children.map(children, (_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 bg-slate-400 rounded-full",
              currentSlide === index && "bg-slate-600"
            )}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
