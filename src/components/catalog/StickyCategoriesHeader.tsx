"use client";
import { motion } from "framer-motion";
import { CartButtonWithPrice, Container } from "@/components/shared";
import { useEffect, useState, useRef } from "react";
import { CategoriesList } from "./CategoriesList";
import { Category } from "@/types/Category";
import { cn } from "@/lib";

interface StickyHeaderProps {
  className?: string;
  categories: Category[];
  currentCategoryId: number;
}

export const StickyCategoriesHeader: React.FC<StickyHeaderProps> = ({
  className,
  categories,
  currentCategoryId,
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
      ref={stickyRef}
      className={cn(
        "sticky top-0 z-50 border-b py-3 overflow-x-auto bg-white px-4 transition-all w-full",
        isSticky ? "bg-white/60 backdrop-blur-md" : "bg-white"
      )}
    >
      <Container>
        <div className="flex justify-between items-center">
          <CategoriesList
            categories={categories}
            currentCategoryId={currentCategoryId}
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
