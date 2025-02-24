import { getCategories } from "@/lib/cache";
import {
  CatalogProductsLoader,
  Categories,
  Filters,
} from "@/components/catalog";
import { Container } from "@/components/shared";
import { filterSmells } from "@/constants";

interface Props {
  params: { categoryId: string };
}

export default async function CatalogPage({ params }: Props) {
  const categories = await getCategories();
  const { categoryId } = await params;
  const formattedCategoryId = Number(categoryId) || categories[0].id;

  return (
    <>
      <Categories
        categories={categories}
        currentCategoryId={formattedCategoryId}
      />
      <Container>
      {/* <Filters smells={filterSmells}></Filters> */}
        <CatalogProductsLoader categoryId={formattedCategoryId} />
      </Container>
    </>
  );
}
