import { getCategories } from "@/lib/cache";
import { CatalogProductsLoader, Categories } from "@/components/catalog";
import { Container } from "@/components/shared";

type Params = Promise<{ categorySlug: string }>;

export default async function CatalogPage(props: { params: Params }) {
  const params = await props.params;
  const categorySlug = params.categorySlug;

  const categories = await getCategories();

  const currentCategory =
    categories.find((cat) => cat.slug === categorySlug) || categories[0];

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
