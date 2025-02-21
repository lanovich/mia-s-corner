import { CategoryButton } from "@/components/shared";
import { Category } from "@/types/Category";

interface CategoriesListProps {
  categories: Category[];
  currentCategoryId: number;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  currentCategoryId,
}) => {
  return (
    <div className="flex space-x-4">
      {categories.map(({ id, name }) => (
        <CategoryButton
          key={id}
          categoryId={id}
          categoryName={name}
          currentCategoryId={currentCategoryId}
        />
      ))}
    </div>
  );
};
