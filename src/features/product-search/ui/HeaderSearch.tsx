"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib";
import { useRouter } from "next/navigation";
import { LINKS } from "@/shared/model";
import {
  useClickOutside,
  useProductSearch,
} from "@/features/product-search/lib";
import { Product, ShortProduct } from "@/entities/product/model";
import { SearchDropdown, SearchInput } from "@/widgets/header/ui";

interface Props {
  className?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

export const HeaderSearch = ({ className, autoFocus, onClose }: Props) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | undefined>("all");

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  console.log(query);

  useClickOutside(containerRef, () => {
    setIsDropdownOpen(false);
  });

  useEffect(() => {
    setIsDropdownOpen(query.trim().length > 0);
  }, [query, category]);

  const { products, isFetching, error } = useProductSearch(
    query,
    category === "all" ? undefined : category
  );

  const handleSelectProduct = (product: ShortProduct) => {
    router.push(
      `${LINKS.CATALOG}/${product.categorySlug}/product/${product.slug}`
    );
    setQuery("");
    setCategory("all");
    onClose ? onClose() : null;
    setIsDropdownOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-col items-center w-full", className)}
    >
      <SearchInput
        autoFocus={autoFocus}
        onFocus={() => setIsDropdownOpen(true)}
        className="w-full"
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
      />

      {query && isDropdownOpen && (
        <SearchDropdown
          products={products}
          isFetching={isFetching}
          error={error}
          onSelect={handleSelectProduct}
        />
      )}
    </div>
  );
};
