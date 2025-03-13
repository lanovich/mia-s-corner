"use client";

import React from "react";
import { useSelectedSizeStore } from "@/store/useSelectedSizeStore";
import { ProductDetail } from "./ProductDetail";

interface Props {
  className?: string;
  product: Product;
}

export const AboutProduct: React.FC<Props> = ({ className, product }) => {
  const selectedSize = useSelectedSizeStore((state) => state.selectedSize);

  return (
    <div className={className}>
      <h3 className="text-xl pb-3 border-b-2 mb-2 font-semibold">О товаре</h3>

      {/* Описание */}
      {product.description && (
        <div className="mb-5">
          <h4 className="text-base font-semibold mb-2">Описание</h4>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Характеристики */}
      <ProductDetail
        title="Характеристики"
        details={[{ label: "Аромат", value: product.compound }]}
      />

      {/* Размеры и комплектация */}
      <ProductDetail
        title="Размеры и комплектация"
        details={
          selectedSize
            ? [
                {
                  label: "Габариты",
                  value: `${selectedSize.dimensions.x} x ${selectedSize.dimensions.y} x ${selectedSize.dimensions.z} см`,
                },
                { label: "Размер", value: `${selectedSize.size} мл` },
              ]
            : [{ label: "Размер", value: "Не выбран" }]
        }
      />

      {/* Дополнительные характеристики */}
      <ProductDetail
        title="Дополнительные характеристики"
        details={[
          { label: "Материал", value: product.wax },
          { label: "Фитиль", value: product.wick },
        ]}
      />
    </div>
  );
};
