import { Breadcrumbs, Container } from "@/shared/ui";
import { CatalogCard } from "@/shared/ui";
import { Metadata } from "next";
import { metadata as rootMetadata } from "@/app/(root)/layout";
import { categoriesApi } from "@/entities/category/api";
import { historiesApi } from "@/entities/history/api";
import { LINKS } from "@/shared/model";

export const metadata: Metadata = {
  ...rootMetadata,
  title:
    "Mia's Corner | Каталог ароматической продукции | Авторские свечи, диффузоры, , саше в СПб",
  description:
    "Купить авторские натуральные свечи и диффузоры в Санкт-Петербурге. Доставка по СПб и России. Свечи в стекле на заказ, аромасаше и диффузоры для дома. Свечи с историей купить СПб",
  alternates: {
    canonical: "https://www.mias-corner.ru/catalog",
  },
  openGraph: {
    ...rootMetadata.openGraph,
    title: "Каталог ароматической продукции | Mia's Corner",
    description:
      "Авторские свечи, диффузоры, саше. Выберите аромат со своей историей.",
    url: "https://www.mias-corner.ru/catalog",
    images: [
      {
        url: "https://www.mias-corner.ru/aromasachet.jpg",
        width: 1200,
        height: 630,
        alt: "Каталог ароматов Mia's Corner",
      },
    ],
  },
  keywords: [
    ...((rootMetadata.keywords as string[]) || []),
    "каталог ароматических свечей",
    "коллекция диффузоров",
    "авторские ароматы СПб",
    "купить свечи в Санкт-Петербурге",
    "натуральные ароматы каталог",
    "эко свечи ручной работы",
    "подарочные наборы с ароматами",
    "авторские  каталог",
    "премиальные ароматы для дома",
  ],
};

export default async function CatalogPage() {
  const categories = await categoriesApi.fetchCategories();
  const histories = await historiesApi.fetchHistories();

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
              description={history.description}
              image={history.imageUrl || "/Placeholder.jpg"}
              href={`${LINKS.CATALOG}/${LINKS.HISTORIES}/${history.id}`}
              slug={history.history_slug}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
