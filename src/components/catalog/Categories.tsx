import { StickyCategoriesHeader } from "./StickyCategoriesHeader";
import { ChapterHeading } from "@/components/shared";
import { Category } from "@/types/Category";

interface CategoriesProps {
  categories: Category[];
  currentCategoryId: number;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  currentCategoryId,
}) => {
  return (
    <>
      <div className="mx-auto">
        <ChapterHeading className="mt-0">Каталог</ChapterHeading>
      </div>
      <StickyCategoriesHeader
        categories={categories}
        currentCategoryId={currentCategoryId}
      />
    </>
  );
};
