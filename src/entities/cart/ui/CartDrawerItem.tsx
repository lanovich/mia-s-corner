"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/entities/cart/model/useCartStore";
import { CartItem } from "@/entities/cart/model";
import { ChangeQuantityButton } from "./ChangeQuantityButton";
import { LINKS } from "@/shared/model";
import { CustomLink } from "@/shared/ui";
import { findSelectedSize } from "@/shared/lib";

interface Props {
  cartItem: CartItem;
}

export const CartDrawerItem: React.FC<Props> = ({ cartItem }) => {
  const { modifyItemQuantity, removeFromCart } = useCartStore();
  const { shortProduct, quantity, productSizeId } = cartItem;

  console.log(shortProduct);

  const selectedSize = shortProduct.size;

  return (
    <div className="flex flex-col border-b pb-4">
      <div className="flex items-center gap-4">
        <CustomLink
          href={`${LINKS.CATALOG}/${shortProduct.categorySlug}/shortProduct/${shortProduct.slug}`}
        >
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={shortProduct.size.image || "/fallback-image.jpg"}
              alt={shortProduct.title}
              fill
              sizes="160px"
              className="object-cover rounded-md"
            />
          </div>
        </CustomLink>

        <div className="flex-1">
          <h4 className="text-sm font-medium">{shortProduct.title}</h4>
          {selectedSize && (
            <p className="text-xs text-gray-700">
              Размер:{" "}
              {`${selectedSize.volume.amount} ${selectedSize.volume.unit}`}
            </p>
          )}
          <p className="text-xs text-gray-500">
            {shortProduct.scent?.name || "Состав не указан"}
          </p>
        </div>

        <button
          onClick={() => selectedSize && removeFromCart(shortProduct.size.id)}
          className="text-gray-400 hover:text-gray-600"
          disabled={!selectedSize}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {selectedSize && (
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-black/50">
            {quantity} × {selectedSize.price} ₽
          </p>

          <div className="flex items-center gap-2">
            <ChangeQuantityButton
              type="decrease"
              quantity={quantity}
              onDecrease={() => modifyItemQuantity(selectedSize.id, -1)}
            />
            <ChangeQuantityButton
              type="increase"
              quantity={quantity}
              onIncrease={() => modifyItemQuantity(selectedSize.id, 1)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
