import { CategoryProduct } from "@/entities/category/model";
import { ProductOption } from "@/entities/product/model";
import React from "react";

interface Props {
  className?: string;
  productDataInSelectedCategory: CategoryProduct | null;
  selectedProduct: ProductOption | null;
}

export const ProductHeading: React.FC<Props> = ({
  className,
  productDataInSelectedCategory,
  selectedProduct,
}) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">
        {productDataInSelectedCategory?.product.title || selectedProduct?.title}
      </h2>
      {selectedProduct?.compound && (
        <span className="text-sm mt-2 text-gray-500">
          ({selectedProduct?.compound})
        </span>
      )}
      <span className="text-sm mt-2 text-gray-500">
        ({selectedProduct?.quantity || 0})
      </span>
    </div>
  );
};
