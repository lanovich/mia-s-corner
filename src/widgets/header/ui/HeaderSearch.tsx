"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib";
import { useRouter } from "next/navigation";
import { LINKS } from "@/shared/model";
import { useClickOutside, useProductSearch } from "../lib";
import { Product } from "@/entities/product/model";
import { SearchDropdown, SearchInput } from ".";

export const HeaderSearch: React.FC<{ className?: string }> = ({
  className,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | undefined>("all");

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  console.log(query);

  useClickOutside(containerRef, () => setIsDropdownOpen(false));

  useEffect(() => {
    setIsDropdownOpen(query.trim().length > 0);
  }, [query, category]);

  const { products, isFetching, error } = useProductSearch(
    query,
    category === "all" ? undefined : category
  );

  const handleSelectProduct = (product: Product) => {
    router.push(
      `${LINKS.CATALOG}/${product.category_slug}/product/${product.slug}`
    );
    setQuery("");
    setCategory("all");
    setIsDropdownOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-col items-center", className)}
    >
      <SearchInput
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
