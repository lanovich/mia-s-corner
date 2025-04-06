"use client";

import { useRouter } from "next/navigation";

interface CategoryButtonProps {
  categorySlug: string;
  categoryName: string;
  currentCategorySlug: string;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  categorySlug,
  categoryName,
  currentCategorySlug,
}) => {
  const router = useRouter();
  const isActive = currentCategorySlug === categorySlug;

  const handleClick = () => {
    router.replace(`/catalog/${categorySlug}`, { scroll: false });
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 text-nowrap rounded-full transition ${
        isActive
          ? "bg-black text-white"
          : "bg-gray-200 text-black hover:bg-gray-300"
      }`}
    >
      {categoryName}
    </button>
  );
};
