"use client";

import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/entities/cart/model/useCartStore";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib";
import { useParams } from "next/navigation";
import { CartDrawer } from ".";
import { LoadingIndicator } from "@/shared/ui";

interface Props {
  className?: string;
}

export const MobileCartButton: React.FC<Props> = ({ className }) => {
  const { cart, itemsCount, isLoading: isCartModifying } = useCartStore();
  const [isLoading, setIsLoading] = useState();
  const params = useParams();

  const isBusy = isLoading || isCartModifying;

  const isProductPage = params?.slug && params.slug.includes("product");

  if (cart.length === 0) return null;

  return (
    <CartDrawer>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={cn(
          "fixed right-3 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-black text-white shadow-lg cursor-pointer md:hidden",
          isProductPage ? "bottom-28" : "bottom-16",
          className
        )}
      >
        <div className="relative">
          <LoadingIndicator isLoading={isBusy} size={22} />
          {!isBusy && <ShoppingBag size={22} />}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute -top-3 -right-3 w-4 h-4 bg-green-500 text-white text-xs flex items-center justify-center rounded-full"
          >
            <LoadingIndicator isLoading={isBusy} size={12} />
            {!isBusy && <>{itemsCount}</>}
          </motion.div>
        </div>
      </motion.div>
    </CartDrawer>
  );
};
