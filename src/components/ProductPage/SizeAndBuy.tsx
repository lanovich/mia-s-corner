"use client";

import React, { useState } from "react";
import { AddToCartButton } from "../shop/ui";
import { Button } from "../shadcn-ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface Props {
  className?: string;
  product: Product;
}

export const SizeAndBuy: React.FC<Props> = ({ className, product }) => {
  const hasSizes = product.sizes && product.sizes.length > 0;
  const [selectedSize, setSelectedSize] = useState<Size | null>(
    hasSizes ? product.sizes[0] : null
  );

  const handleAddToFavorite = () => {
    toast.info("Разработчик Николай обещал добавить эту функцию, ждём 😅")
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Размеры */}
      {hasSizes && (
        <div className="flex gap-2">
          {product.sizes.map((size) => (
            <Button
              key={size.id}
              onClick={() => setSelectedSize(size)}
              className={`border px-3 py-1 text-sm ${
                selectedSize?.id === size.id
                  ? "bg-black text-white"
                  : "bg-inherit text-black border-black"
              }`}
            >
              {`${size.size} мл`}
            </Button>
          ))}
        </div>
      )}

      {/* Цена */}
      <div className="flex items-center gap-2">
        <span
          className={`mt-3 text-4xl  ${
            selectedSize?.oldPrice ? "text-red-500" : "text-black"
          }`}
        >
          {selectedSize?.price ?? product.sizes[0].price} ₽
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
          product={product}
          selectedSize={selectedSize}
          className="flex flex-1 border-2 text-lg font-semibold"
        >
          Добавить в корзину
        </AddToCartButton>

        <button onClick={handleAddToFavorite}>
          <Heart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
