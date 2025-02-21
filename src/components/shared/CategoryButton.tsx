"use client";

import { useRouter } from "next/navigation";

interface CategoryButtonProps {
  categoryId: number;
  categoryName: string;
  currentCategoryId: number;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  categoryId,
  categoryName,
  currentCategoryId,
}) => {
  const router = useRouter();
  const isActive = currentCategoryId === categoryId;

  const handleClick = () => {
    router.replace(`/catalog/${categoryId}`, { scroll: false });
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-full transition ${
        isActive
          ? "bg-black text-white"
          : "bg-gray-200 text-black hover:bg-gray-300"
      }`}
    >
      {categoryName}
    </button>
  );
};
