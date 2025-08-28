"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/shared/shadcn-ui";
import { ShoppingBag } from "lucide-react";
import { CartDrawer } from "./CartDrawer";
import { useCartStore } from "@/entities/cart/model/useCartStore";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/shared/lib";

interface Props {
  className?: string;
}

export const CartButtonWithPrice: React.FC<Props> = ({ className }) => {
  const { cart, fullPrice } = useCartStore();
  const [scrambledPrice, setScrambledPrice] = useState(fullPrice.toString());

  const priceMotion = useMotionValue(fullPrice);

  useEffect(() => {
    priceMotion.set(fullPrice);
    let iterations = 0;
    const scrambleInterval = setInterval(() => {
      const randomNum = Math.floor(
        Math.random() * 10 ** String(fullPrice).length
      );
      setScrambledPrice(randomNum.toString());
      iterations++;

      if (iterations > 5) {
        clearInterval(scrambleInterval);
        setScrambledPrice(fullPrice.toString());
      }
    }, 50);

    return () => clearInterval(scrambleInterval);
  }, [fullPrice]);

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
              <motion.p className="flex items-center justify-center">
                {scrambledPrice} ₽
              </motion.p>

              <ShoppingBag />

              {cart.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs flex items-center justify-center rounded-full"
                >
                  {cart.length}
                </motion.div>
              )}
            </Button>
          </div>
        </CartDrawer>
      }
    </>
  );
};
