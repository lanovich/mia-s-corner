import { Product } from "@/types";
import Link from "next/link";
import React from "react";

export const ProductCard: React.FC<Product> = ({
  id,
  title,
  compound,
  imageUrl,
  price,
  size,
}) => {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-xl transition-transform duration-300 ease-in-out hover:scale-105">
      {/* Карточка товара */}
      <div className="card">
        {/* Изображение товара */}
        <img
          src={imageUrl}
          className="h-full w-full object-cover"
          alt="свечки"
        />

        {/* Контейнер с текстом и кнопкой */}
        <div
          className="absolute bottom-0 z-10 w-full min-h-[30%] h-[40%] group-hover:h-full bg-white bg-opacity-30 backdrop-blur-md px-4 py-3 flex flex-col justify-between 
    overflow-hidden transition-[height] duration-300 ease-in-out"
        >
          {/* Заголовок и размер товара */}
          <div className="flex flex-col gap-1">
            <span className="ProductHeading">{title}</span>
            <span className="text-xs text-black/50">{size}</span>
          </div>

          {/* Описание и кнопка */}
          <div className="flex items-center justify-between">
            <p className="text-[0.675rem] text-black/50 line-clamp-2">
              {compound}
            </p>
            <button className="flex items-center gap-1 rounded-lg border border-black px-3 py-2 text-black transition hover:bg-black hover:text-white">
              <span>+</span>
              <span>{price}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
