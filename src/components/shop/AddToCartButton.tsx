"use client";

import { toast } from "sonner";
import { cn } from "@/lib";
import { useCartStore } from "@/store/useCartStore";
import { MouseEvent, useCallback, useState, ChangeEvent } from "react";
import { Hexagon, Minus, Plus, ShoppingCart } from "lucide-react";
import throttle from "lodash.throttle";
import QuantityButton from "./QuantityButton";

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
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const existingCartItem = cart.find(
    (cartItem) =>
      cartItem.product.id === selectedSize?.product_id &&
      cartItem.size_id === selectedSize?.size_id
  );

  const handleModifyQuantity = useCallback(
    throttle(async (event: MouseEvent<HTMLButtonElement>, delta: number) => {
      event.preventDefault();
      event.stopPropagation();

      if (!selectedSize) {
        return toast.error("Выберите размер перед добавлением в корзину!", {
          position: "top-center",
        });
      }

      try {
        setLoading(true);
        await modifyItemQuantity(
          selectedSize.product_id,
          selectedSize.size_id,
          delta
        );
        if (delta > 0) {
          toast.success("Товар добавлен в корзину", { position: "top-center" });
        } else {
          toast.success("Товар удален из корзины", { position: "top-center" });
        }
      } catch (error) {
        toast.error("Ошибка изменения количества товара!", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    }, 0),
    [modifyItemQuantity, selectedSize]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value;

    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value === "" ? "0" : value);
    }
  };

  const handleInputBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (!selectedSize || !existingCartItem) return;

    const newQuantity = parseInt(inputValue) || 0;
    const delta = newQuantity - existingCartItem.quantity;

    if (delta !== 0) {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    setInputValue("");
  };

  return existingCartItem ? (
    <div
      className={cn(
        "flex items-center rounded-lg border border-black text-lg font-semibold px-2 py-1 sm:px-3 sm:py-2 min-h-[40px] sm:min-h-[50px] w-full",
        className,
        loading ? "opacity-50" : ""
      )}
    >
      <QuantityButton
        onClick={(event) => handleModifyQuantity(event, -1)}
        icon={<Minus className="w-4 h-4 sm:w-5 sm:h-5" />}
        loading={loading}
        className={"rounded-l-md"}
      />
      <input
        type="text"
        value={inputValue || existingCartItem.quantity}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="whitespace-nowrap border-x mx-1 border-black w-1/3 px-2 sm:px-4 text-center overflow-hidden bg-transparent focus:outline-none"
        disabled={loading}
      />
      <QuantityButton
        onClick={(event) => handleModifyQuantity(event, 1)}
        icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
        loading={loading}
        className={"rounded-r-md"}
      />
    </div>
  ) : (
    <div
      className={cn(
        "flex items-center rounded-lg text-lg font-semibold min-h-[40px] sm:min-h-[50px] w-full border-none",
        className,
        loading ? "opacity-50" : ""
      )}
    >
      <QuantityButton
        onClick={(event) => handleModifyQuantity(event, 1)}
        className={
          "flex items-center justify-center rounded-lg border border-black px-2 py-1 sm:px-3 sm:py-2 text-black transition hover:bg-black hover:text-white min-h-[40px] sm:min-h-[50px] w-full"
        }
        icon={
          loading ? (
            <Hexagon className="animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">{children}</span>
              <ShoppingCart className="sm:hidden w-5 h-5" />
            </>
          )
        }
        loading={loading}
      />
    </div>
  );
};
