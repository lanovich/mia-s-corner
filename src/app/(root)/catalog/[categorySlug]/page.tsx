import { Metadata } from "next";
import { getCategories } from "@/lib/cache";
import { CatalogProductsLoader, Categories } from "@/components/catalog";
import { Container } from "@/components/shared";

type Params = Promise<{ categorySlug: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const params = await props.params;
  const categories = await getCategories();
  const currentCategory =
    categories.find((cat) => cat.slug === params.categorySlug) || categories[0];

  const getCategoryDescription = (slug: string) => {
    const descriptions = {
      candles:
        "Авторские соевые свечи ручной работы из натуральных материалов с уникальными ароматами. Долгое горение, экологичные материалы, уникальные композиции. Истории",
      diffusers:
        "Ароматические диффузоры для дома с натуральными ароматическими маслами. Постепенное раскрытие аромата, срок службы 3-6 месяцев.",
      perfumes:
        "Уникальные  ручной работы с индивидуальными нотами. Стойкие композиции, прекрасный аромат",
    };
    return (
      descriptions[slug as keyof typeof descriptions] ||
      `${currentCategory.name.toLowerCase()}. Авторские ароматические продукты ручной работы.`
    );
  };

  return {
    title: `${currentCategory.name} | Mia's Corner | Купить в Санкт-Петербурге`,
    description: getCategoryDescription(currentCategory.slug),
    alternates: {
      canonical: `https://www.mias-corner.ru/catalog/${currentCategory.slug}`,
    },
    openGraph: {
      title: `${currentCategory.name} | Mia's Corner | Ароматическая продукция`,
      description: getCategoryDescription(currentCategory.slug),
      url: `https://www.mias-corner.ru/catalog/${currentCategory.slug}`,
      images: [
        {
          url: currentCategory.image || "https://www.mias-corner.ru/og.jpg",
          width: 630,
          height: 630,
          alt: `Категория ${currentCategory.name}`,
        },
      ],
    },
    keywords: [
      `купить ${currentCategory.name.toLowerCase()} СПб`,
      `${currentCategory.name.toLowerCase()} ручной работы`,
      `${
        currentCategory.slug === "candles"
          ? "соевые свечи"
          : "ароматические диффузоры"
      } Санкт-Петербург`,
      `натуральные ${currentCategory.name.toLowerCase()}`,
      `авторские ${currentCategory.name.toLowerCase()} Mia's Corner`,
      `${
        currentCategory.slug === "candles"
          ? "свечи в стеклянных банках"
          : "стеклянные диффузоры"
      }`,
      `${currentCategory.slug === "candles" ? "деревянный фитиль" : "палочки"}`,
      `Наборы ${currentCategory.name.toLowerCase()}`,
    ],
  };
}

export default async function CatalogPage(props: { params: Params }) {
  const params = await props.params;
  const categories = await getCategories();
  const currentCategory =
    categories.find((cat) => cat.slug === params.categorySlug) || categories[0];

  return (
    <>
      <Categories
        categories={categories}
        currentCategorySlug={currentCategory.slug}
      />
      <Container>
        <CatalogProductsLoader categoryId={currentCategory.id} />
      </Container>
    </>
  );
}
