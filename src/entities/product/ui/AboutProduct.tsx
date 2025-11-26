"use client";

import React, { useMemo } from "react";
import { useSelectedSizeStore } from "@/entities/product/model/useSelectedSizeStore";
import { ProductDetail } from "./ProductDetail";
import { Product } from "../model";

interface Props {
  className?: string;
  product: Product;
}

interface DetailItem {
  label: string;
  value: string;
}

export const AboutProduct: React.FC<Props> = ({ className, product }) => {
  const selectedSize = useSelectedSizeStore((state) => state.selectedSize);
  const dimensions = selectedSize?.props?.dimensions;

  const mainDetails: DetailItem[] = useMemo(() => {
    return [
      {
        label: "Аромат",
        value: product.scent?.name ?? "Не найден",
      },
    ];
  }, [product]);

  const sizeDetails: DetailItem[] = useMemo(() => {
    if (!selectedSize) {
      return [{ label: "Размер", value: "Не выбран" }];
    }

    const items: DetailItem[] = [];

    if (dimensions) {
      items.push({
        label: "Габариты",
        value: `${[dimensions.width, dimensions.height, dimensions.length]
          .filter(Boolean)
          .join("x")} мм`,
      });
    }

    if (selectedSize.volume?.amount && selectedSize.volume.unit) {
      items.push({
        label: "Объём",
        value: `${selectedSize.volume.amount} ${selectedSize.volume.unit}`,
      });
    }

    return items;
  }, [selectedSize, dimensions]);

  return (
    <div className={className}>
      <h3 className="text-xl pb-3 border-b-2 mb-2 font-semibold">О товаре</h3>

      {product.description && (
        <div className="mb-5">
          <h4 className="text-base font-semibold mb-2">Описание</h4>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {mainDetails.length > 0 && (
        <ProductDetail title="Характеристики" details={mainDetails} />
      )}

      {sizeDetails.length > 0 && (
        <ProductDetail title="Размеры и комплектация" details={sizeDetails} />
      )}
    </div>
  );
};
