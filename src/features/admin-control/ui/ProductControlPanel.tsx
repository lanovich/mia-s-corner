"use client";

import { useAdminStore } from "@/features/admin-control/model/useAdminStore";
import { cn } from "@/shared/lib";
import { ProductHeading } from "./ProductHeading";
import { ProductDetails } from "../sections/ProductDetails";
import { PlaceholderForm } from ".";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Product, Size } from "@/entities/product/model";
import { adminApi } from "../api";

interface ProductControlPanelProps {
  className?: string;
}

export const ProductControlPanel: React.FC<ProductControlPanelProps> = ({
  className,
}) => {
  const { selectedProductOption } = useAdminStore();

  const [selectedFullProduct, setSelectedFullProduct] =
    useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchProduct = useCallback(async () => {
    if (!selectedProductOption) return;
    setIsLoading(true);
    try {
      const data = await adminApi.fetchFullProductById(
        selectedProductOption.id
      );
      setSelectedFullProduct(data);
    } catch (error) {
      console.error(error);
      toast.error("Не удалось загрузить данные продукта");
    } finally {
      setIsLoading(false);
    }
  }, [selectedProductOption]);

  useEffect(() => {
    handleFetchProduct();
  }, [handleFetchProduct]);

  if (!selectedProductOption) {
    return (
      <div
        className={cn(
          "min-h-[800px] flex items-center justify-center text-3xl",
          className
        )}
      >
        Выбери продукт
      </div>
    );
  }

  if (isLoading || !selectedFullProduct) {
    return (
      <div className={cn("min-h-[800px]", className)}>
        <div className="flex flex-row gap-2 mb-2">
          <div className="h-8 bg-gray-200 rounded-sm w-3/5" />
          <div className="h-6 bg-gray-200 rounded-sm w-1/5 mt-2" />
          <div className="h-6 bg-gray-200 rounded-sm w-10 mt-2" />
        </div>
        <div className="flex h-10 w-full bg-gray-100 items-center rounded-md mb-4" />
        <div className="flex h-6 w-1/6 bg-gray-200 items-center rounded-sm mb-2" />
        <div className="flex h-[140px] w-full bg-gray-100 items-center justify-center rounded-md mb-4" />
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <ProductHeading
        className="bg-white flex flex-row gap-2"
        selectedProductData={selectedFullProduct}
        selectedOption={selectedProductOption}
      />

      <ProductDetails
        className="min-h-[800px]"
        selectedProductData={selectedFullProduct}
        onProductUpdated={handleFetchProduct}
      />
    </div>
  );
};
