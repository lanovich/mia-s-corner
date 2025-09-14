import { useCartStore } from "@/entities/cart/model/useCartStore";
import { Card, CardContent } from "@/shared/shadcn-ui/card";
import { Skeleton } from "@/shared/shadcn-ui";
import Image from "next/image";
import React from "react";
import { findSelectedSize } from "@/shared/lib";
import { CustomLink } from "@/shared/ui";
import { LINKS } from "@/shared/model";

interface Props {
  className?: string;
}

export const OrderSummary: React.FC<Props> = ({ className }) => {
  const { isLoading, cart } = useCartStore();

  return (
    <div className={className}>
      <h1 className="text-xl font-semibold border-b pb-3 mt-3">Ваш заказ</h1>
      {isLoading ? (
        <div className="mt-4 space-y-4">
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {cart.map(({ product, quantity, size_id }) => {
            const selectedSize = findSelectedSize(product, size_id);
            const price = selectedSize ? selectedSize.price : 0;
            const measure = product.measure;

            return (
              <Card
                key={`${product.id}-${size_id}`}
                className="border-gray-300"
              >
                <CardContent className="flex items-center justify-between gap-2 py-2">
                  <CustomLink
                    href={`${LINKS.CATALOG}/${product.category_slug}/product/${product.slug}`}
                  >
                    <Image
                      src={product.images[0].url}
                      width={60}
                      height={60}
                      alt={product.title}
                      className="rounded-sm object-cover"
                    />
                  </CustomLink>

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
                  <span className="font-medium whitespace-nowrap mr-2">
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
