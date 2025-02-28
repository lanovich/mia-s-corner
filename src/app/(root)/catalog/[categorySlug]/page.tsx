import { getCategories } from "@/lib/cache";
import {
  CatalogProductsLoader,
  Categories,
  Filters,
} from "@/components/catalog";
import { Container } from "@/components/shared";

interface Props {
  params: { categorySlug: string };
}

export default async function CatalogPage({ params }: Props) {
  const categories = await getCategories();

  const { categorySlug } = await params;


  const currentCategory =
    categories.find((cat) => cat.slug === categorySlug) || categories[0];

  return (
    <>
      <Categories
        categories={categories}
        currentCategorySlug={currentCategory.slug}
      />
      <Container>
      {/* <Filters smells={filterSmells}></Filters> */}
        <CatalogProductsLoader categoryId={currentCategory.id} />
      </Container>
    </>
  );
}
