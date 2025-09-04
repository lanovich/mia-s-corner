"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/shared/shadcn-ui";
import { ShoppingBag } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useCartStore } from "@/entities/cart/model/useCartStore";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib";
import { useScrambledPrice } from "../lib/useScrambledPrice";
import { LoadingIndicator } from "@/shared/ui";

interface Props {
  className?: string;
}

export const CartButtonWithPrice: React.FC<Props> = ({ className }) => {
  const {
    cart,
    fullPrice,
    isLoading: isCartModifying,
    itemsCount,
  } = useCartStore();
  const scrambledPrice = useScrambledPrice(fullPrice);
  const [isLoading, setIsLoading] = useState(true);

  const isBusy = isLoading || isCartModifying;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {
        <CartDrawer>
          <div className={"flex items-center gap-2 h-full"}>
            <Button
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 w-24",
                className
              )}
            >
              <LoadingIndicator isLoading={isBusy} size={16} />
              {!isBusy && (
                <motion.p className="flex items-center justify-center">
                  {scrambledPrice} ₽
                </motion.p>
              )}

              <ShoppingBag />

              {cart.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs flex items-center justify-center rounded-full"
                >
                  <LoadingIndicator isLoading={isBusy} size={12} />
                  {!isBusy && <>{itemsCount}</>}
                </motion.div>
              )}
            </Button>
          </div>
        </CartDrawer>
      }
    </>
  );
};
