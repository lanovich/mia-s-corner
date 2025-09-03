"use client";

import { toast } from "sonner";
import { cn } from "@/shared/lib";
import { useCartStore } from "@/entities/cart/model/useCartStore";
import { MouseEvent, useCallback, useState, ChangeEvent } from "react";
import { Hexagon, Minus, Plus, ShoppingCart } from "lucide-react";
import { QuantityButton } from "@/shared/ui";
import { ProductSize } from "@/entities/product/model";

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
  const [isLoading, setIsLoading] = useState(false);

  const [inputValue, setInputValue] = useState<string | null>(null);

  const existingCartItem = cart.find(
    (cartItem) =>
      cartItem.product.id === selectedSize?.product_id &&
      cartItem.size_id === selectedSize?.size_id
  );

  const displayQuantity =
    inputValue !== null ? inputValue : existingCartItem?.quantity ?? 0;

  const handleModifyQuantity = async (
    event: MouseEvent<HTMLButtonElement>,
    delta: number
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedSize) {
      return toast.error("Выберите размер перед добавлением в корзину!", {
        position: "top-center",
      });
    }

    setIsLoading(true);

    try {
      await modifyItemQuantity(
        selectedSize.product_id,
        selectedSize.size_id,
        delta
      );
      toast.success(
        delta > 0 ? "Товар добавлен в корзину" : "Товар удален из корзины",
        { position: "top-center" }
      );
    } catch (error) {
      console.error(error)
      toast.error("Ошибка при изменении количества товара!", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value;

    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value === "" ? null : value);
    }
  };

  const handleInputBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (!selectedSize || !existingCartItem) return;

    const newQuantity = parseInt(inputValue ?? "") || 0;
    const delta = newQuantity - existingCartItem.quantity;

    if (delta !== 0) {
      try {
        await modifyItemQuantity(
          selectedSize.product_id,
          selectedSize.size_id,
          delta
        );
        toast.success("Количество товара изменено", { position: "top-center" });
      } catch (error) {
        toast.error("Ошибка изменения количества товара!", {
          position: "top-center",
        });
      }
    }
    setInputValue(null);
  };

  return existingCartItem ? (
    <div
      className={cn(
        "flex items-center rounded-lg border border-black text-lg font-semibold px-2 py-1 sm:px-3 sm:py-2 min-h-[40px] sm:min-h-[50px] w-full",
        className,
        isLoading ? "opacity-50" : ""
      )}
    >
      <QuantityButton
        onClick={(event) => handleModifyQuantity(event, -1)}
        icon={<Minus className="w-4 h-4 sm:w-5 sm:h-5" />}
        loading={isLoading}
        className={"rounded-l-md"}
      />
      <input
        type="text"
        value={displayQuantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="whitespace-nowrap border-x mx-1 border-black w-1/3 px-2 sm:px-4 text-center overflow-hidden bg-transparent focus:outline-none"
        disabled={isLoading}
      />
      <QuantityButton
        onClick={(event) => handleModifyQuantity(event, 1)}
        icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
        loading={isLoading}
        className={"rounded-r-md"}
      />
    </div>
  ) : (
    <div
      className={cn(
        "flex items-center rounded-lg text-lg font-semibold min-h-[40px] sm:min-h-[50px] w-full border-none",
        className,
        isLoading ? "opacity-50" : ""
      )}
    >
      <QuantityButton
        onClick={(event) => handleModifyQuantity(event, 1)}
        className={
          "flex items-center justify-center rounded-lg border border-black px-2 py-1 sm:px-3 sm:py-2 text-black transition hover:bg-black hover:text-white min-h-[40px] sm:min-h-[50px] w-full"
        }
        icon={
          isLoading ? (
            <Hexagon className="animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">{children}</span>
              <ShoppingCart className="sm:hidden w-5 h-5" />
            </>
          )
        }
        loading={isLoading}
      />
    </div>
  );
};
