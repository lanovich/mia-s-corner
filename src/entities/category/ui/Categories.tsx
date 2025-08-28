import { Category } from "@/entities/category/model";
import { StickyCategoriesHeader } from "./StickyCategoriesHeader";
import { Breadcrumbs, ChapterHeading } from "@/shared/ui";

interface CategoriesProps {
  categories: Category[];
  currentCategorySlug: string;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  currentCategorySlug,
}) => {
  return (
    <>
      <Breadcrumbs categorySlug={currentCategorySlug} />
      <div className="mx-auto">
        <ChapterHeading className="my-3">Каталог</ChapterHeading>
      </div>
      <StickyCategoriesHeader
        categories={categories}
        currentCategorySlug={currentCategorySlug}
      />
    </>
  );
};
