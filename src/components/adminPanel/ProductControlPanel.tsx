"use client";

import { ProductsByCategory } from "@/lib/getProductsGroupedByCategory";
import { useAdminStore } from "@/store/useAdminStore";
import { SelectCategoryField } from "./SelectCategoryField";
import { cn, findCurrentProduct } from "@/lib";
import { CATEGORY_SLUG_MAP } from "@/constants/categorySlugMap";
import { ProductHeading } from "./ProductHeading";
import { ProductDetails } from "./ProductDetails";
import { PlaceholderForm } from ".";

interface ProductControlPanelProps {
  className?: string;
  categorizedProducts: ProductsByCategory;
}

interface CategoryOption {
  id: number;
  title: string;
  slug: string;
  quantity?: number;
}

export const ProductControlPanel: React.FC<ProductControlPanelProps> = ({
  className,
  categorizedProducts,
}) => {
  const { selectedProduct, selectedCategory } = useAdminStore();

  const productsInAllCategories = findCurrentProduct(
    categorizedProducts,
    selectedProduct?.title
  );

  const categoryOptions: CategoryOption[] = productsInAllCategories.map(
    ({ categorySlug, product }, index) => ({
      id: index,
      title: CATEGORY_SLUG_MAP[categorySlug] || categorySlug,
      slug: categorySlug,
      quantity: product.categorizedQuantity,
    })
  );

  const productDataInSelectedCategory =
    productsInAllCategories.find(
      (p) => p.categorySlug === selectedCategory?.slug
    )?.product || productsInAllCategories[0]?.product;

  if (!selectedProduct || productsInAllCategories.length === 0) {
    return (
      <div className={cn("min-h-[800px]", className)}>
        <div className="flex flex-row gap-2 mb-2">
          <div className="h-8 bg-gray-200 rounded-sm w-3/5"></div>
          <div className="h-6 bg-gray-200 rounded-sm w-1/5 mt-2"></div>
          <div className="h-6 bg-gray-200 rounded-sm w-10 mt-2"></div>
        </div>
        <div className="flex h-10 w-full bg-gray-100 items-center rounded-md mb-4">
          <p className="text-gray-500 text-md ml-4 -mt-1">
            Выберите продукт для просмотра деталей
          </p>
        </div>
        <div className="flex h-6 w-1/6 bg-gray-200 items-center rounded-sm mb-2" />
        <div className="flex h-[140px] w-full bg-gray-100 items-center justify-center rounded-md mb-4" />
        <PlaceholderForm />
      </div>
    );
  }

  console.log(productDataInSelectedCategory);

  return (
    <div className={cn("", className)}>
      <ProductHeading
        className="bg-white flex flex-row gap-2"
        productDataInSelectedCategory={productDataInSelectedCategory}
        selectedProduct={selectedProduct}
      />
      <SelectCategoryField options={categoryOptions} className="w-full" />

      <ProductDetails
        className="min-h-[800px]"
        productDataInSelectedCategory={productDataInSelectedCategory}
      />
    </div>
  );
};
