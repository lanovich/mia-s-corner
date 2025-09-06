"use client";

import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";
import { CartButtonWithPrice } from "@/entities/cart/ui";
import { Category } from "@/entities/category/model";
import { useSticky } from "@/shared/lib";
interface Props {
  categories: Category[];
  current: number;
  className?: string;
  handleCategoryClick: (index: number) => void;
}

export const ProductCategories: React.FC<Props> = ({
  categories,
  current,
  handleCategoryClick,
  className,
}) => {
  const { ref: stickyRef, isSticky, isMobile } = useSticky();

  return (
    <div
      ref={stickyRef}
      className={cn(
        "px-5 inline-flex gap-7 overflow-x-auto whitespace-nowrap mx-auto w-full sticky top-0 z-50 h-1/6 bg-white snap-x snap-mandatory flex-nowrap scroll-px-4 justify-start  md:justify-center md:ml-0",
        isSticky ? "bg-white/60 backdrop-blur-md" : "bg-white",
        className
      )}
    >
      {categories.map(({ id, name }, index) => (
        <button
          key={id}
          className={cn(
            "box-border items-center font-bold my-4 px-[4px] gap-10 rounded-none relative snap-center border-l-2 border-b-2 border-transparent",
            current === index && "border-black pl-1"
          )}
          onClick={() => handleCategoryClick(index)}
        >
          {name}
        </button>
      ))}
      {!isMobile && isSticky && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <CartButtonWithPrice className=" ml-4" />
        </motion.div>
      )}
    </div>
  );
};
