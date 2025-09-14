"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/entities/cart/model/useCartStore";
import { CartItem } from "@/entities/cart/model";
import { ChangeQuantityButton } from "./ChangeQuantityButton";
import { LINKS } from "@/shared/model";
import { CustomLink } from "@/shared/ui";

interface Props {
  cartItem: CartItem;
}

export const CartDrawerItem: React.FC<Props> = ({ cartItem }) => {
  const { modifyItemQuantity, removeFromCart } = useCartStore();
  const { product, quantity, size_id } = cartItem;

  const selectedSize = product.product_sizes.find(
    (size) => size.size_id === size_id
  );

  return (
    <div className="flex flex-col border-b pb-4">
      {/* Верхний блок: Изображение + Информация + Удаление */}
      <div className="flex items-center gap-4">
        {/* Изображение товара */}
        <CustomLink
          href={`${LINKS.CATALOG}/${product.category_slug}/product/${product.slug}`}
        >
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={product.images?.[0]?.url || "/fallback-image.jpg"}
              alt={product.title}
              fill
              sizes="160px"
              className="object-cover rounded-md"
            />
          </div>
        </CustomLink>

        {/* Информация о товаре */}
        <div className="flex-1">
          <h4 className="text-sm font-medium">{product.title}</h4>
          {selectedSize && (
            <p className="text-xs text-gray-700">
              Размер: {`${selectedSize.size.size} ${product.measure}`}
            </p>
          )}
          <p className="text-xs text-gray-500">
            {product.compound || "Состав не указан"}
          </p>
        </div>

        {/* Удаление товара */}
        <button
          onClick={() =>
            selectedSize && removeFromCart(product.id, selectedSize.size_id)
          }
          className="text-gray-400 hover:text-gray-600"
          disabled={!selectedSize}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Нижний блок: Количество + Управление количеством */}
      {selectedSize && (
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-black/50">
            {quantity} × {selectedSize.price} ₽
          </p>

          <div className="flex items-center gap-2">
            <ChangeQuantityButton
              type="decrease"
              quantity={quantity}
              onDecrease={() =>
                modifyItemQuantity(
                  selectedSize.product_id,
                  selectedSize.size_id,
                  -1
                )
              }
            />
            <ChangeQuantityButton
              type="increase"
              quantity={quantity}
              onIncrease={() =>
                modifyItemQuantity(
                  selectedSize.product_id,
                  selectedSize.size_id,
                  1
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};
