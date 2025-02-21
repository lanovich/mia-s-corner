"use client";

import { getProductsByCategory } from "@/lib";
import { ProductGroupList } from "./ProductGroupList";
import useSWR from "swr";

interface Props {
  categoryId: number;
}

export function ProductsLoader({ categoryId }: Props) {
  const { data: products, error } = useSWR(
    [`/api/products`, categoryId],
    () => getProductsByCategory(categoryId),
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
      dedupingInterval: Infinity,
    }
  );

  if (error) return <p className="text-red-500">Ошибка загрузки товаров</p>;
  if (!products) return <p className="text-gray-500">Загрузка товаров...</p>;

  return <ProductGroupList products={products} />;
}
