"use client";

import { ProductSize } from "@/entities/product/model";
import { useCartQuantity } from "../lib";
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
  const {
    cartItem,
    isLoading,
    inputValue,
    inc,
    dec,
    handleAddToCart,
    handleInputChange,
    handleInputBlur,
  } = useCartQuantity(selectedSize);

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
    <CartAddButton isLoading={isLoading} onClick={handleAddToCart}>
      {children}
    </CartAddButton>
  );
};
