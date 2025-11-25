"use client";

import React from "react";
import { Product, ShortProduct } from "@/entities/product/model";
import Image from "next/image";
import { LoadingIndicator } from "@/shared/ui";

interface Props {
  products: ShortProduct[];
  isFetching: boolean;
  error?: string | null;
  onSelect: (product: ShortProduct) => void;
  className?: string;
}

export const SearchDropdown: React.FC<Props> = ({
  products,
  isFetching,
  error,
  onSelect,
  className,
}) => {
  return (
    <div
      className={`absolute top-full left-0 right-0 bg-white shadow-lg border-black/10 border-[1px] rounded-lg mt-2 max-h-80 overflow-y-auto z-50 ${className}`}
    >
      {isFetching && (
        <div className="w-full flex justify-center items-center p-7">
          <LoadingIndicator isLoading={isFetching} size={24} />
        </div>
      )}

      {error && <div className="p-7 text-sm text-red-500">{error}</div>}

      {!isFetching && !error && products.length === 0 && (
        <div className="w-full flex justify-center items-center p-[30px] text-sm text-gray-500">
          Ничего не найдено
        </div>
      )}

      {!isFetching &&
        !error &&
        products.map((product) => (
          <div
            key={product.id}
            className="flex gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(product)}
          >
            {product?.size.image && (
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src={product?.size?.image || "/Placeholder.jpg"}
                  alt={product.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}

            <div className="flex flex-col">
              <span className="font-medium">{product.title}</span>
              {product.scent?.name && (
                <span className="text-sm text-gray-600">
                  {product.scent?.name}
                </span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};
