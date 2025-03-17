import { useCartStore } from "@/store/useCartStore";
import { Card, CardContent } from "../shadcn-ui/card";
import Image from "next/image";
import React from "react";
import { Skeleton } from "../shadcn-ui/skeleton";
import { findSelectedSize } from "@/lib";

export const OrderSummary = () => {
  const products = useCartStore((state) => state.cart);
  const loading = useCartStore((state) => state.loading);

  return (
    <div>
      <h1 className="text-xl font-semibold border-b pb-3">Ваш заказ</h1>
      {loading ? (
        <div className="mt-4 space-y-4">
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {products.map(({ product, quantity, size_id }) => {
            const selectedSize = findSelectedSize(product, size_id);
            const price = selectedSize ? selectedSize.price : 0;
            const measure = product.measure;

            return (
              <Card key={`${product.id}-${size_id}`} className="border-gray-300">
                <CardContent className="flex items-center justify-between gap-4 py-3">
                  <Image
                    src={product.images[0].url}
                    width={40}
                    height={40}
                    alt={product.title}
                    className="rounded-lg object-cover min-w-10 h-10"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.title}</p>
                    <p className="text-xs text-gray-400">
                      {selectedSize
                        ? `Размер: ${selectedSize.size.size} ${measure}`
                        : "Размер не выбран"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {price} ₽ × {quantity}
                    </p>
                  </div>
                  <span className="font-medium whitespace-nowrap">
                    {price * quantity} ₽
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
