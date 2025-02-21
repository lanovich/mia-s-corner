"use client";

import { toast } from "sonner";
import { cn } from "@/lib";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { MouseEvent } from "react";

interface Props {
  product: Product;
  className?: string;
}

export const AddToCartButton: React.FC<Props> = ({ product, className }) => {
  const { addToCart, cart, decreaseQuantity } = useCartStore();
  const existingCartItem = cart.find(
    (cartItem) => cartItem.product.id === product.id
  );

  const handleAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await addToCart(product);
      toast.success("Товар добавлен в корзину", { position: "bottom-right" });
    } catch (error) {
      toast.error("Ошибка добавления товара!");
    }
  };

  const DecreaseQuantityInCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    decreaseQuantity(product.id);
  };
  return (
    // TODO: исправить логику удаления из корзины
    // <>
    //   <button
    //     className="items-center rounded-md border border-black px-1 py-1 text-black transition hover:bg-black hover:text-white"
    //     onClick={DecreaseQuantityInCart}
    //   >
    //     -
    //   </button>
    <button
      onClick={handleAddToCart}
      className={cn(
        "flex items-center gap-1 rounded-lg border border-black px-3 py-2 text-black transition hover:bg-black hover:text-white",
        className
      )}
    >
      {existingCartItem ? (
        existingCartItem.quantity
      ) : (
        <>
          <span>+</span>
          <span>{product.price}</span>
        </>
      )}
    </button>
  );
};
