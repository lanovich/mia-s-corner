import React, { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { CategoryWithProducts } from "./types";
import { calcNumberOfProducts } from "./lib";

interface Props {
  category: CategoryWithProducts;
}

export const ProductGroupList: React.FC<Props> = React.memo(({ category }) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const productsToShow = category.products.slice(
    0,
    calcNumberOfProducts(windowWidth)
  );

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  console.log("ширина экрана: ", windowWidth);

  return (
    <div className="my-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 gap-[20px] md:gap-[30px] mx-5">
      {productsToShow.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});
