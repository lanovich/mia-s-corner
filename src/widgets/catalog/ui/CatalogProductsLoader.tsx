import { Container } from "@/shared/ui";
import { ProductCard } from "@/entities/product/ui";
import { getProductsByCategory } from "@/entities/product/api";

interface Props {
  categoryId: number;
}

export async function CatalogProductsLoader({ categoryId }: Props) {
  const products = await getProductsByCategory(categoryId);
  if (!products) return <p className="text-gray-500">Загрузка товаров...</p>;

  return (
    <Container>
      <div className="my-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 mx-5">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Нет товаров в этой категории
          </p>
        )}
      </div>
    </Container>
  );
}
