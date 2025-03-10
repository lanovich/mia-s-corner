import { getCategories } from "@/lib/cache";
import { Container } from "@/components/shared";
import { Breadcrumbs } from "@/components/ProductPage";
import { LoadingLink } from "@/components/catalog";

export default async function CatalogPage() {
  const categories = await getCategories();

  return (
    <>
      <Breadcrumbs />
      <Container className="mb-5">
        {/* Заголовок страницы */}
        <h1 className="text-3xl font-bold text-center my-6">Категории каталога </h1>

        {/* Сетка категорий */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
          {categories.map(
            (category: {
              slug: string;
              name: string;
              image?: string;
              description?: string;
            }) => (
              <LoadingLink
                key={category.slug}
                href={`/catalog/${category.slug}`}
                className="block w-full h-[300px] relative overflow-hidden rounded-lg group"
              >
                {/* Фоновое изображение */}
                {category.image && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                )}

                {/* Затемнение фона */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Контент карточки */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white text-center">
                  <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                  {category.description && (
                    <p className="text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </LoadingLink>
            )
          )}
        </div>
      </Container>
    </>
  );
}
