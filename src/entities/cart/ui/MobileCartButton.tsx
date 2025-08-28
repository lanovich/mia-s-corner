"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { motion } from "framer-motion";
import { cn } from "@/lib";
import { useParams } from "next/navigation";
import { CartDrawer } from ".";

interface Props {
  className?: string;
}

export const MobileCartButton: React.FC<Props> = ({ className }) => {
  const { cart } = useCartStore();
  const params = useParams();

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
          "fixed right-3 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-black text-white shadow-lg cursor-pointer md:hidden",
          isProductPage ? "bottom-28" : "bottom-16",
          className
        )}
      >
        <div className="relative">
          <ShoppingBag size={22} />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute -top-3 -right-3 w-4 h-4 bg-green-500 text-white text-xs flex items-center justify-center rounded-full"
          >
            {cart.length}
          </motion.div>
        </div>
      </motion.div>
    </CartDrawer>
  );
};
