"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/shared/shadcn-ui";
import { Hexagon, ShoppingBag } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useCartStore } from "@/entities/cart/model/useCartStore";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/shared/lib";
import { useScrambledPrice } from "../lib/useScrambledPrice";

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
              {isLoading || isCartModifying ? (
                <Hexagon className="animate-spin" />
              ) : (
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
                  {isLoading || isCartModifying ? (
                    <Hexagon className="animate-spin w-1 h-1" />
                  ) : (
                    <>{itemsCount}</>
                  )}
                </motion.div>
              )}
            </Button>
          </div>
        </CartDrawer>
      }
    </>
  );
};
