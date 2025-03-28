import { getCategories, getHistories } from "@/lib/cache";
import { Container } from "@/components/shared";
import { Breadcrumbs } from "@/components/ProductPage";
import { CatalogCard } from "@/components/shared";
import { LINKS } from "@/constants";

export default async function CatalogPage() {
  const categories = await getCategories();
  const histories = await getHistories();

  return (
    <>
      <Breadcrumbs />
      <Container className="mb-5">
        {/* Заголовок страницы */}
        <h1 className="text-3xl font-bold text-center my-6">Категории</h1>

        {/* Сетка категорий */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
          {categories.map((category) => (
            <CatalogCard
              key={category.slug}
              slug={category.slug}
              title={category.name}
              image={category.image}
              href={`/catalog/${category.slug}`}
            />
          ))}
        </div>

        {/* Заголовок для историй */}
        <h2 className="text-3xl font-bold text-center my-6">Истории</h2>

        {/* Сетка историй */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
          {histories.map((history) => (
            <CatalogCard
              key={history.order}
              title={history.title}
              image={"/Placeholder.jpg"}
              description={history.description}
              href={`${LINKS.CATALOG}/${LINKS.HISTORIES}/${history.id}`}
              slug={history.history_slug}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
