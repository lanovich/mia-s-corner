import Image from "next/image";
import { Trash2 } from "lucide-react";
import { CartItem, useCartStore } from "@/store/useCartStore";
import { ChangeQuantityButton } from "./ui";

interface Props {
  cartItem: CartItem;
}

// TODO: разделить этот компонент на более мелкие

export const CartDrawerItem: React.FC<Props> = ({ cartItem }) => {
  const { decreaseQuantity, removeFromCart, addToCart } = useCartStore();
  const { product, quantity } = cartItem;
  return (
    <div className="flex flex-col border-b pb-4">
      {/* Верхний блок: Изображение + Информация + Удаление */}
      <div className="flex items-center gap-4">
        {/* Изображение товара */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={product.image_url}
            alt={product.title}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>

        {/* Информация о товаре */}
        <div className="flex-1">
          <h4 className="text-sm font-medium">{product.title}</h4>
          <p className="text-xs text-gray-500">{product.compound}</p>
        </div>

        {/* Удаление товара */}
        <button
          onClick={() => removeFromCart(product.id)}
          className="text-gray-400 hover:text-gray-600"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Нижний блок: Количество + Управление количеством */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-sm text-black/50">
          {quantity} × {product.price} ₽
        </p>

        <div className="flex items-center gap-2">
          <ChangeQuantityButton
            type="decrease"
            quantity={quantity}
            onDecrease={() => decreaseQuantity(product.id)}
          />
          <ChangeQuantityButton
            type="increase"
            quantity={quantity}
            onIncrease={() => addToCart(product.id)}
          />
        </div>
      </div>
    </div>
  );
};
