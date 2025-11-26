"use client";

import { cn } from "@/shared/lib";
import React from "react";
import { AddToCartButton } from "@/features/modify-cart-quantity/ui";
import { Button } from "@/shared/shadcn-ui";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/shadcn-ui/dialog";
import { toast } from "sonner";
import { useSelectedSizeStore } from "@/entities/product/model/useSelectedSizeStore";
import { ProductSize } from "@/entities/product/model";

interface Props {
  className?: string;
  sizes: ProductSize[];
  unit: string;
}

export const MobileSizeAndBuy: React.FC<Props> = ({
  className,
  sizes,
  unit,
}) => {
  const { selectedSize, setSelectedSize } = useSelectedSizeStore();

  const handleAddToFavorite = () => {
    toast.info("Разработчик Николай обещал добавить эту функцию, ждём 😅", {
      position: "top-center",
    });
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)] p-4 flex items-center justify-between gap-2 z-40 text-nowrap",
        className
      )}
    >
      {selectedSize && (
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-red-500">
              {selectedSize.price} ₽
            </span>
            {selectedSize.oldPrice && (
              <span className="text-sm line-through text-gray-500">
                {selectedSize.oldPrice} ₽
              </span>
            )}
          </div>
        </div>
      )}

      <AddToCartButton
        selectedSize={selectedSize}
        className="flex flex-1 border-2"
      >
        <span>Добавить в корзину</span>
      </AddToCartButton>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="border border-black">
            {selectedSize
              ? `${selectedSize?.volume?.amount} ${unit}`
              : "Выбрать размер"}
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
          <div className="flex flex-wrap gap-2 mx-auto md:mx-0">
            {sizes?.map((size) => (
              <div key={size.id} className="flex-col flex">
                <Button
                  onClick={() => setSelectedSize(size)}
                  className={`border px-3 py-1 text-sm ${
                    selectedSize?.id === size.id
                      ? "bg-black text-white"
                      : "bg-inherit text-black border-black"
                  }`}
                >
                  {`${size.volume.amount} ${unit}`}
                </Button>
                <p className="text-center text-xs mt-1 text-gray-700">
                  {size.price} ₽
                </p>
              </div>
            ))}
          </div>
          <DialogClose asChild>
            <Button className="w-full mt-4 rounded-lg">Выбрать</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <button onClick={handleAddToFavorite} className="p-2">
        <Heart className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
};
