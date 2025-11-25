"use client";

import React, { useEffect } from "react";
import { AddToCartButton } from "@/features/modify-cart-quantity/ui";
import { Button } from "@/shared/shadcn-ui";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useSelectedSizeStore } from "@/entities/product/model/useSelectedSizeStore";
import { ProductSize } from "@/entities/product/model";

interface Props {
  className?: string;
  unit: string;
  sizes: ProductSize[];
}

export const SizeAndBuy: React.FC<Props> = ({ className, sizes, unit }) => {
  const hasSizes = sizes && sizes.length > 0;
  const { selectedSize, setSelectedSize } = useSelectedSizeStore();

  useEffect(() => {
    if (!hasSizes) return;

    const defaultSize = sizes.find((s) => s.isDefault) || sizes[0];
    setSelectedSize(defaultSize);
  }, [sizes, hasSizes, setSelectedSize]);

  const handleAddToFavorite = () => {
    toast.info("Разработчик Николай обещал добавить эту функцию, ждём 😅", {
      position: "top-center",
    });
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {hasSizes && (
        <div className="flex gap-2 flex-wrap">
          {sizes
            .sort((a, b) => a?.volume?.amount - b?.volume?.amount)
            .map((size) => (
              <Button
                key       = {size.id}
                onClick   = {() => setSelectedSize(size)}
                className = {`border px-3 py-1 text-sm hover:text-white ${
                  selectedSize?.id === size.id
                    ? "bg-black text-white"
                    : "bg-inherit text-black border-black"
                }`}
              >
                {`${size?.volume?.amount} ${unit}`}
              </Button>
            ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span
          className={`mt-3 text-3xl ${
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

      <div className="flex items-center gap-4 mr-10 md:min-w-80">
        <AddToCartButton selectedSize={selectedSize} className="flex flex-1">
          <p className="text-lg">Добавить в корзину</p>
        </AddToCartButton>

        <button onClick={handleAddToFavorite}>
          <Heart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
