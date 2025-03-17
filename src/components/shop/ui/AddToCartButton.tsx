"use client";

import { toast } from "sonner";
import { cn } from "@/lib";
import { useCartStore } from "@/store/useCartStore";
import { MouseEvent } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

interface Props {
  selectedSize: ProductSize | null;
  className?: string;
  children?: React.ReactNode;
}

export const AddToCartButton: React.FC<Props> = ({
  selectedSize,
  className,
  children,
}) => {
  const { modifyItemQuantity, cart } = useCartStore();

  const existingCartItem = cart.find(
    (cartItem) =>
      cartItem.product.id === selectedSize?.product_id &&
      cartItem.size_id === selectedSize?.size_id
  );

  const handleModifyQuantity = async (
    event: MouseEvent<HTMLButtonElement>,
    delta: number
  ) => {
    event.preventDefault();
    if (!selectedSize) {
      return toast.error("Выберите размер перед добавлением в корзину!", {
        position: "top-center",
      });
    }
    try {
      await modifyItemQuantity(selectedSize.product_id, selectedSize.size_id, delta);
      if (delta > 0) {
        toast.success("Товар добавлен в корзину", { position: "top-center" });
      } else {
        toast.success("Товар удален из корзины", { position: "top-center" });
      }
    } catch (error) {
      toast.error("Ошибка изменения количества товара!", {
        position: "top-center",
      });
    }
  };

  return existingCartItem ? (
    <div
      className={cn(
        "flex items-center rounded-lg border border-black text-lg font-semibold px-2 py-1 sm:px-3 sm:py-2 min-h-[40px] sm:min-h-[50px] w-full",
        className
      )}
    >
      <button
        onClick={(event) => handleModifyQuantity(event, -1)}
        className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-8 hover:bg-black transition hover:text-white rounded-l-lg"
      >
        <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <span className="whitespace-nowrap border-x border-black flex-1 px-2 sm:px-4 text-center overflow-hidden">
        {existingCartItem.quantity}
      </span>
      <button
        onClick={(event) => handleModifyQuantity(event, 1)}
        className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-8 hover:bg-black transition hover:text-white rounded-r-lg"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  ) : (
    <button
      onClick={(event) => handleModifyQuantity(event, 1)}
      className={cn(
        "flex items-center justify-center rounded-lg border border-black px-2 py-1 sm:px-3 sm:py-2 text-black transition hover:bg-black hover:text-white min-h-[40px] sm:min-h-[50px] w-full",
        className
      )}
    >
      <span className="hidden sm:inline">{children}</span>
      <ShoppingCart className="sm:hidden w-5 h-5" />
    </button>
  );
};
