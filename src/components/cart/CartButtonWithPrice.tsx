'use client'

import React from "react";
import { Button } from "../shadcn-ui/button";
import { ShoppingBag } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useCartStore } from "@/store/useCartStore";

interface Props {
  className?: string;
}

export const CartButtonWithPrice: React.FC<Props> = ({ className }) => {
  const { cart, totalAmount } = useCartStore();

  return (
    <CartDrawer>
      <div className="flex items-center gap-2 h-full">
        <Button className="relative flex items-center gap-2 px-4 py-2">
          <p className="flex items-center justify-center">{totalAmount} ₽</p>
          <ShoppingBag />
          {cart.length > 0 && (
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 text-white text-xs flex items-center justify-center rounded-full">
              {cart.length}
            </div>
          )}
        </Button>
      </div>
    </CartDrawer>
  );
};
