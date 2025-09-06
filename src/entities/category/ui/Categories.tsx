import { Category } from "@/entities/category/model";
import { StickyCategoriesHeader } from "./StickyCategoriesHeader";
import { Breadcrumbs, ChapterHeading } from "@/shared/ui";

interface CategoriesProps {
  categories: Category[];
  categoryInfo: { slug: string; name: string };
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  categoryInfo,
}) => {
  return (
    <>
      <Breadcrumbs
        categoryInfo={{
          slug: categoryInfo.slug,
          name: categoryInfo.name || categoryInfo.slug,
        }}
      />
      <div className="mx-auto">
        <ChapterHeading className="my-1">Каталог</ChapterHeading>
      </div>
      <StickyCategoriesHeader
        categories={categories}
        currentCategorySlug={categoryInfo.slug}
      />
    </>
  );
};
