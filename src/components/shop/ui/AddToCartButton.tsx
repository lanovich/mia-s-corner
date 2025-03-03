"use client";

import { toast } from "sonner";
import { cn } from "@/lib";
import { useCartStore } from "@/store/useCartStore";
import { MouseEvent } from "react";
import { Minus, Plus } from "lucide-react";

interface Props {
  product: Product;
  selectedSize: Size | null;
  className?: string;
  children?: React.ReactNode;
}

export const AddToCartButton: React.FC<Props> = ({
  product,
  selectedSize,
  className,
  children,
}) => {
  const { addToCart, decreaseQuantity, removeFromCart, cart } = useCartStore();

  const existingCartItem = cart.find(
    (cartItem) =>
      cartItem.product.id === product.id && cartItem.sizeId === selectedSize?.id
  );

  const handleAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!selectedSize) {
      return toast.error("Выберите размер перед добавлением в корзину!");
    }
    try {
      await addToCart(product.id, selectedSize.id);
      toast.success("Товар добавлен в корзину", { position: "bottom-right" });
    } catch (error) {
      toast.error("Ошибка добавления товара!");
    }
  };

  const handleDecrease = async () => {
    if (selectedSize && existingCartItem) {
      await decreaseQuantity(product.id, selectedSize.id);
      toast.success("Товар удален из корзины", { position: "bottom-right" });
    }
  };

  return existingCartItem ? (
    <div
      className={cn(
        "flex items-center rounded-lg border border-black text-lg font-semibold px-3 py-2 h-[50px]",
        className
      )}
    >
      <button
        onClick={handleDecrease}
        className="flex flex-1 items-center justify-center w-12 h-8 mr-2 hover:bg-black transition hover:text-white rounded-l-lg"
      >
        <Minus />
      </button>
      <span className="whitespace-nowrap border-x border-black px-10">
        {existingCartItem.quantity} шт
      </span>
      <button
        onClick={handleAddToCart}
        className="flex flex-1 items-center justify-center w-12 h-8 ml-2 hover:bg-black transition hover:text-white rounded-r-lg"
      >
        <Plus />
      </button>
    </div>
  ) : (
    <button
      onClick={handleAddToCart}
      className={cn(
        "flex items-center justify-center rounded-lg border border-black px-3 py-2 text-black transition hover:bg-black hover:text-white h-[50px]",
        className
      )}
    >
      Добавить в корзину
    </button>
  );
};
