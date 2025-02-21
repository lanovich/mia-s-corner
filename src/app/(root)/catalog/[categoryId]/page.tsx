import { getCategories } from "@/lib/cache";
import { CatalogProductsLoader, Categories } from "@/components/catalog";
import { Container } from "@/components/shared";

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
        <CatalogProductsLoader categoryId={formattedCategoryId} />
      </Container>
    </>
  );
}
