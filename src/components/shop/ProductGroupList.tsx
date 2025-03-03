import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
}

export const ProductGroupList: React.FC<Props> = ({ products }) => {
  return (
    <div className="my-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 gap-[20px] md:gap-[30px] mx-5">
      {products.length > 0 ? (
        products.map((product) => <ProductCard key={product.id} product={product} />)
      ) : (
        <p className="text-center text-gray-500">Нет товаров в этой категории</p>
      )}
    </div>
  );
};
