import { StickyCategoriesHeader } from "./StickyCategoriesHeader";
import { ChapterHeading } from "@/components/shared";

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
      <div className="mx-auto">
        <ChapterHeading className="mt-0">Каталог</ChapterHeading>
      </div>
      <StickyCategoriesHeader
        categories={categories}
        currentCategorySlug={currentCategorySlug}
      />
    </>
  );
};
