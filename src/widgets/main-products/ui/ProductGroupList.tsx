"use client";

import { useEffect, useState } from "react";
import { calcNumberOfProducts } from "../lib";
import { ProductCard } from "@/entities/product/ui";
import { ShortProduct } from "@/entities/product/model";

interface Props {
  products: ShortProduct[];
}

export const ProductGroupList: React.FC<Props> = ({ products }) => {
  const [numberOfProducts, setNumberOfProducts] = useState(6);

  const updateNumberOfProducts = () => {
    const width = window.innerWidth;
    const calculatedNumber = calcNumberOfProducts(width);
    setNumberOfProducts(calculatedNumber);
  };

  useEffect(() => {
    updateNumberOfProducts();
    window.addEventListener("resize", updateNumberOfProducts);

    return () => {
      window.removeEventListener("resize", updateNumberOfProducts);
    };
  }, []);

  if (products.length <= 0) {
    return (
      <div className="text-center mx-auto text-gray-700 m-5">
        Нет товаров в этой категории
      </div>
    );
  }

  return (
    <>
      <div className="my-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 gap-[10px] md:gap-[30px] px-3">
        {products.length > 0
          ? products
              .slice(0, numberOfProducts)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
          : null}
      </div>
    </>
  );
};
