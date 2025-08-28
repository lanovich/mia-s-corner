import { CategoryButton } from "@/components/shared";
import { Category } from "@/entities/category/model";

interface CategoriesListProps {
  categories: Category[];
  currentCategorySlug: string;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  currentCategorySlug,
}) => {
  return (
    <div className="flex space-x-4">
      {categories.map(({ id, name, slug }) => (
        <CategoryButton
          key={id}
          categorySlug={slug}
          categoryName={name}
          currentCategorySlug={currentCategorySlug}
        />
      ))}
    </div>
  );
};
