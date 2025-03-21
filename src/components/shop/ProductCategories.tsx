"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CartButtonWithPrice } from "../cart";
import { useEffect, useRef, useState } from "react";
interface Props {
  categories: Category[];
  current: number;
  handleCategoryClick: (index: number) => void;
}

export const ProductCategories: React.FC<Props> = ({
  categories,
  current,
  handleCategoryClick,
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      if (!stickyRef.current) return;
      const { top } = stickyRef.current.getBoundingClientRect();
      setIsSticky(top <= 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="px-5 inline-flex gap-7 overflow-x-auto whitespace-nowrap mx-auto w-full sticky top-0 z-50 h-1/6 bg-white snap-x snap-mandatory flex-nowrap scroll-px-4 justify-start  md:justify-center md:ml-0"
    >
      {categories.map(({ id, name }, index) => (
        <button
          key={id}
          className={cn(
            "box-border items-center font-bold my-5 px-[2px] gap-10 rounded-none relative snap-center",
            current === index && "border-l-2 border-b-2 border-black"
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
          <CartButtonWithPrice className="ml-4" />
        </motion.div>
      )}
    </div>
  );
};
