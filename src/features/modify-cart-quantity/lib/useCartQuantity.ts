"use client";

import { useCartStore } from "@/entities/cart/model/useCartStore";
import {
  useState,
  useMemo,
  useCallback,
  MouseEvent,
  ChangeEvent,
  useEffect,
} from "react";
import { toast } from "sonner";
import { ProductSize } from "@/entities/product/model";
import { findCartItem } from "../lib";

export function useCartQuantity(selectedSize: ProductSize | null) {
  const { modifyItemQuantity, cart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string | null>(null);

  const cartItem = useMemo(
    () => findCartItem(cart, selectedSize),
    [cart, selectedSize]
  );

  const updateQuantity = useCallback(
    async (newQuantity: number) => {
      if (!selectedSize || !cartItem) return;

      if (newQuantity < 0) {
        toast.error("Количество не может быть меньше 0", {
          position: "top-center",
        });
        setInputValue(String(cartItem.quantity));
        return;
      }
      if (newQuantity > 20) {
        toast.error("Одного наименования не может быть больше 20", {
          position: "top-center",
        });
        setInputValue(String(cartItem.quantity));
        return;
      }

      const delta = newQuantity - cartItem.quantity;
      if (delta === 0) return;

      setIsLoading(true);
      try {
        await modifyItemQuantity(
          selectedSize.product_id,
          selectedSize.size_id,
          delta
        );
        toast.success("Количество товара изменено", { position: "top-center" });
        setInputValue(null);
      } catch {
        toast.error("Ошибка изменения количества товара!", {
          position: "top-center",
        });
        setInputValue(String(cartItem.quantity));
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSize, cartItem, modifyItemQuantity]
  );

  const inc = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      updateQuantity(cartItem ? cartItem.quantity + 1 : 1);
    },
    [cartItem, updateQuantity]
  );

  const dec = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (cartItem) updateQuantity(cartItem.quantity - 1);
    },
    [cartItem, updateQuantity]
  );

  const handleAddToCart = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
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
          1
        );
        toast.success("Товар добавлен в корзину", { position: "top-center" });
      } catch {
        toast.error("Ошибка при добавлении товара!", {
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [modifyItemQuantity, selectedSize]
  );

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
<<<<<<< HEAD
<<<<<<< HEAD
    e.preventDefault();
    e.stopPropagation();
=======
>>>>>>> 1f68040 (feat(cart): moved all cart handlers to a hook and fixed input behavior)
=======
    e.preventDefault();
    e.stopPropagation();
>>>>>>> 821d546 (fix:)
    const v = e.target.value;
    if (v === "") {
      setInputValue("");
    } else if (/^\d+$/.test(v)) {
      setInputValue(v);
    }
  }, []);

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 821d546 (fix:)
  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (inputValue === null || !cartItem) return;
      const newQuantity = inputValue === "" ? 0 : parseInt(inputValue, 10);
      updateQuantity(newQuantity);
    },
    [inputValue, cartItem, updateQuantity]
  );
<<<<<<< HEAD
=======
  const handleInputBlur = useCallback(() => {
    if (inputValue === null || !cartItem) return;
    const newQuantity = inputValue === "" ? 0 : parseInt(inputValue, 10);
    updateQuantity(newQuantity);
  }, [inputValue, cartItem, updateQuantity]);
>>>>>>> 1f68040 (feat(cart): moved all cart handlers to a hook and fixed input behavior)
=======
>>>>>>> 821d546 (fix:)

  return {
    cartItem,
    isLoading,
    inputValue,
    inc,
    dec,
    handleAddToCart,
    handleInputChange,
    handleInputBlur,
  };
}
