"use client";

import { toast } from "sonner";
import { useCartStore } from "@/entities/cart/model/useCartStore";
import { MouseEvent, useState, ChangeEvent, useMemo, useCallback } from "react";
import { ProductSize } from "@/entities/product/model";
import { findCartItem } from "../lib";
import { CartAddButton, CartQuantityInput } from ".";

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

  const cartItem = useMemo(
    () => findCartItem(cart, selectedSize),
    [cart, selectedSize]
  );

  // --- quantity modification ---
  const handleModifyQuantity = useCallback(
    async (event: MouseEvent<HTMLButtonElement>, delta: number) => {
      event.preventDefault();
      event.stopPropagation();
      if (!selectedSize) {
        toast.error("Выберите размер перед добавлением в корзину!", {
          position: "top-center",
        });
        return;
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
      } catch {
        toast.error("Ошибка при изменении количества товара!", {
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [modifyItemQuantity, selectedSize]
  );

  const dec = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => handleModifyQuantity(e, -1),
    [handleModifyQuantity]
  );
  const inc = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => handleModifyQuantity(e, 1),
    [handleModifyQuantity]
  );

  // --- input handling ---
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const v = e.target.value;
    if (v === "" || /^\d+$/.test(v)) setInputValue(v === "" ? null : v);
  }, []);

  const handleInputBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement>) => {
      if (!selectedSize || !cartItem) return;
      const newQuantity = parseInt(inputValue ?? "") || 0;
      const delta = newQuantity - cartItem.quantity;
      if (delta !== 0) {
        try {
          await modifyItemQuantity(
            selectedSize.product_id,
            selectedSize.size_id,
            delta
          );
          toast.success("Количество товара изменено", {
            position: "top-center",
          });
        } catch {
          toast.error("Ошибка изменения количества товара!", {
            position: "top-center",
          });
        }
      }
      setInputValue(null);
    },
    [cartItem, inputValue, modifyItemQuantity, selectedSize]
  );

  return cartItem ? (
    <CartQuantityInput
      quantity={cartItem.quantity}
      inputValue={inputValue}
      onInc={inc}
      onDec={dec}
      onInputChange={handleInputChange}
      onInputBlur={handleInputBlur}
      isLoading={isLoading}
    />
  ) : (
    <CartAddButton isLoading={isLoading} onClick={inc}>
      {children}
    </CartAddButton>
  );
};
