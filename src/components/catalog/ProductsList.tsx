import { getProductsByCategory } from "@/lib/cache";
import { ProductCard } from "@/components/shop";
import { Container } from "@/components/shared";

interface Props {
  categoryId: number;
}

export const ProductsList = async ({ categoryId }: Props) => {
  const products = await getProductsByCategory(categoryId);

  return (
    <Container>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 mx-5">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">Нет товаров в этой категории</p>
        )}
      </div>
    </Container>
  );
}
