"use client";

import { ProductsByCategory } from "@/lib/getProductsGroupedByCategory";
import { useAdminStore } from "@/store/useAdminStore";
import { SelectCategoryField } from "./SelectCategoryField";
import { cn, findCurrentProduct } from "@/lib";
import { CATEGORY_SLUG_MAP } from "@/constants/categorySlugMap";
import { Button } from "../shadcn-ui/button";
import { useState } from "react";
import { Input } from "../shadcn-ui/input";

interface Props {
  className?: string;
  categorizedProducts: ProductsByCategory;
}

interface CategoryOption {
  id: number;
  title: string;
  slug: string;
  quantity?: number;
}

export const ProductControlPanel: React.FC<Props> = ({
  className,
  categorizedProducts,
}) => {
  const { selectedProduct, selectedCategory } = useAdminStore();
  const [selectedSize, setSelectedSize] = useState<number>(0);

  const matchingProducts = findCurrentProduct(
    categorizedProducts,
    selectedProduct?.title
  );

  const categoryOptions: CategoryOption[] = matchingProducts.map(
    ({ categorySlug, product }, index) => ({
      id: index,
      title: CATEGORY_SLUG_MAP[categorySlug] || categorySlug,
      slug: categorySlug,
      quantity: product.categorizedQuantity,
    })
  );

  const currentProduct =
    matchingProducts.find((p) => p.categorySlug === selectedCategory?.slug)
      ?.product || matchingProducts[0]?.product;

  if (!selectedProduct || matchingProducts.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <p className="text-gray-500">Выберите продукт для просмотра деталей</p>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <div className="bg-white flex flex-row gap-2">
        <h2 className="text-xl font-semibold mb-4">
          {currentProduct?.product.title || selectedProduct.title}
        </h2>
        {selectedProduct.compound && (
          <span className="text-sm mt-2 text-gray-500">
            ({selectedProduct.compound})
          </span>
        )}
        <span className="text-sm mt-2 text-gray-500">
          ({currentProduct?.categorizedQuantity || 0})
        </span>
      </div>

      <SelectCategoryField options={categoryOptions} className="w-full" />

      {currentProduct?.product.sizes?.length > 0 && (
        <div className="bg-white space-y-3">
          <h3 className="text-sm text-gray-500 mt-4">Размеры:</h3>

          {/* Размеры */}
          <div className="flex flex-col gap-2">
            <div>
              {currentProduct.product.sizes
                .sort((a, b) => {
                  const sizeA = a.size ? parseFloat(a.size) : 0;
                  const sizeB = b.size ? parseFloat(b.size) : 0;
                  return sizeA - sizeB;
                })
                .map((size, index) => (
                  <Button
                    key={index}
                    onClick={() => setSelectedSize(size.id)}
                    className={
                      " p-2 border-2 gap-2 rounded-lg max-w-36 min-w-24 "
                    }
                    disabled={selectedSize === size.id}
                  >
                    {size.size || "Без размера"} - {size.quantity} шт
                  </Button>
                ))}
            </div>
            {/* Разделитель */}
            <div>
              {/* Инпут с изменением размера */}
              {/* Инпут с изменением старого размера */}
              {/* 3 инпута с габаритами */}
              {/* Время эксплатуатации инпут */}
              {/* По умолчанию или нет? */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
