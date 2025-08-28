"use client";

import React from "react";
import { useSelectedSizeStore } from "@/entities/product/model/useSelectedSizeStore";
import { ProductDetail } from "./ProductDetail";
import { ProductWithHistory } from "@/entities/product/model";
interface Props {
  className?: string;
  product: ProductWithHistory;
}

export const AboutProduct: React.FC<Props> = ({ className, product }) => {
  const selectedSize = useSelectedSizeStore((state) => state.selectedSize);

  const additionalDetails = product.details
    ? Object.entries(product.details).map(([key, value]) => ({
        label: key,
        value: value,
      }))
    : [];

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
                  value: `${selectedSize.size.dimensions.x} x ${selectedSize.size.dimensions.y} x ${selectedSize.size.dimensions.z} мм`,
                },
                { label: "Размер", value: `${selectedSize.size.size} мл` },
              ]
            : [{ label: "Размер", value: "Не выбран" }]
        }
      />

      {/* Дополнительные характеристики (если details есть) */}
      {additionalDetails.length > 0 && (
        <ProductDetail
          title="Дополнительные характеристики"
          details={additionalDetails}
        />
      )}
    </div>
  );
};
