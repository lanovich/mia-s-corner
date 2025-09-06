"use client";

import { motion } from "framer-motion";
import { Container } from "@/shared/ui";
import { CartButtonWithPrice } from "@/entities/cart/ui";
import { useEffect, useState, useRef } from "react";
import { cn, useSticky } from "@/shared/lib";
import { Category } from "@/entities/category/model";
import { CategoriesList } from "./CategoriesList";

interface StickyHeaderProps {
  className?: string;
  categories: Category[];
  currentCategorySlug: string;
}

export const StickyCategoriesHeader: React.FC<StickyHeaderProps> = ({
  className,
  categories,
  currentCategorySlug,
}) => {
  const { ref: stickyRef, isSticky, isMobile } = useSticky();

  return (
    <div
      ref={stickyRef}
      className={cn(
        "sticky top-0 z-50 border-b py-2 overflow-x-auto bg-white px-4 transition-all w-full",
        isSticky ? "bg-white/60 backdrop-blur-md" : "bg-white",
        className
      )}
    >
      <Container>
        <div className="flex justify-between items-center">
          <CategoriesList
            categories={categories}
            currentCategorySlug={currentCategorySlug}
          />

          {!isMobile && isSticky && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <CartButtonWithPrice className="ml-4" />
            </motion.div>
          )}
        </div>
      </Container>
    </div>
  );
};
