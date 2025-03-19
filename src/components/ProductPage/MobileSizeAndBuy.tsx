"use client";

import { cn } from "@/lib";
import React, { useState } from "react";
import { AddToCartButton } from "../shop/ui";
import { Button } from "../shadcn-ui/button";
import { Dot, Heart, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/shadcn-ui/dialog";
import { toast } from "sonner";

interface Props {
  className?: string;
  sizes: ProductSize[];
}

export const MobileSizeAndBuy: React.FC<Props> = ({ className, sizes }) => {
  const hasSizes = sizes.length > 0;
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    hasSizes ? sizes[0] : null
  );

  const handleAddToFavorite = () => {
    toast.info("Разработчик Николай обещал добавить эту функцию, ждём 😅", { position: "top-center" });
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex items-center justify-between gap-4 z-50 text-nowrap",
        className
      )}
    >
      {/* Кнопка добавления в корзину */}
      <AddToCartButton
        selectedSize={selectedSize}
        className="flex flex-1 border-2"
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        <span>В корзину</span>
        <Dot></Dot>
        {selectedSize?.size_id && (
          <span className="font-semibold">{selectedSize.size.size} ₽</span>
        )}
      </AddToCartButton>

      {/* Кнопка выбора размера */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-2 border-black">
            {selectedSize ? `${selectedSize.size.size} мл` : "Выбрать размер"}
          </Button>
        </DialogTrigger>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-3">
              Размеры в наличии
            </DialogTitle>
            <DialogDescription>
              Убедитесь, что выбранный размер вам подходит, ознакомившись с
              описанием и фото
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size.size_id}
                onClick={() => setSelectedSize(size)}
                className={`border px-3 py-1 text-sm ${
                  selectedSize?.size_id === size.size_id
                    ? "bg-black text-white"
                    : "bg-inherit text-black border-black"
                }`}
              >
                {`${size.size} мл`}
              </Button>
            ))}
          </div>
          <DialogClose asChild>
            <Button className="w-full mt-4">Выбрать</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Кнопка добавления в избранное */}
      <button onClick={handleAddToFavorite} className="p-2">
        <Heart className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
};
