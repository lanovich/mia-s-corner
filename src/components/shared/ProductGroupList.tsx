import { Product } from '@/types';
import React from 'react';
import { ProductCard } from '.';

interface Props {
  categoryTitle: string;
  categoryId: number;
  products: Product[];
}

export const ProductGroupList: React.FC<Props> = ({ categoryTitle, categoryId, products }) => {
  return (
    <div className="my-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 gap-[20px] md:gap-[30px] mx-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          compound={product.compound}
          size={product.size}
          imageUrl={product.imageUrl}
          price={product.price}
        />
      ))}
    </div>
  );
};

