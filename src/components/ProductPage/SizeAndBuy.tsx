"use client";

import React from "react";
import { AddToCartButton } from "../shop";
import { Button } from "../shadcn-ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useSelectedSizeStore } from "@/store/useSelectedSizeStore";

interface Props {
  className?: string;
  sizes: ProductSize[];
}

export const SizeAndBuy: React.FC<Props> = ({ className, sizes }) => {
  const hasSizes = sizes && sizes.length > 0;
  const { selectedSize, setSelectedSize } = useSelectedSizeStore();

  if (!selectedSize && hasSizes) {
    setSelectedSize(sizes.find((size) => size.is_default === true) || sizes[0]);
  }

  const handleAddToFavorite = () => {
    toast.info("Разработчик Николай обещал добавить эту функцию, ждём 😅", {
      position: "top-center",
    });
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Размеры */}
      {hasSizes && (
        <div className="flex gap-2 flex-wrap">
          {sizes
            .sort((a, b) => a.size.size - b.size.size)
            .map((size) => (
              <Button
                key={size.size_id}
                onClick={() => setSelectedSize(size)}
                className={`border px-3 py-1 text-sm hover:text-white ${
                  selectedSize?.size_id === size.size_id
                    ? "bg-black text-white"
                    : "bg-inherit text-black border-black"
                }`}
              >
                {`${size.size.size} мл`}
              </Button>
            ))}
        </div>
      )}

      {/* Цена */}
      <div className="flex items-center gap-2">
        <span
          className={`mt-3 text-4xl ${
            selectedSize?.oldPrice ? "text-red-500" : "text-black"
          }`}
        >
          {selectedSize?.price ?? sizes[0].price} ₽
        </span>

        {selectedSize?.oldPrice && (
          <span className="text-lg text-gray-400 line-through">
            {selectedSize.oldPrice} ₽
          </span>
        )}
      </div>

      {/* Кнопка добавления в корзину и избранное */}
      <div className="flex items-center gap-4 mr-10">
        <AddToCartButton
          selectedSize={selectedSize}
          className="flex flex-1 border-2"
        >
          <p className="text-lg font-semibold">Добавить в корзину</p>
        </AddToCartButton>

        <button onClick={handleAddToFavorite}>
          <Heart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
