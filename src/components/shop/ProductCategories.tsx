"use client";

import { cn } from "@/lib/utils";
interface Props {
  categories: Category[];
  current: number;
  handleCategoryClick: (index: number) => void;
}

export const ProductCategories: React.FC<Props> = ({ categories, current, handleCategoryClick }) => {
  return (
    <div className="px-5 inline-flex gap-7 overflow-x-auto whitespace-nowrap mx-auto w-full sticky top-0 z-50 h-1/6 bg-white snap-x snap-mandatory flex-nowrap scroll-px-4 justify-start  md:justify-center md:ml-0">
      {categories.map(({ id, name }, index) => (
        <button
          key={id}
          className={cn(
            "box-border items-center font-bold my-5 px-[2px] gap-10 rounded-none relative snap-center",
            current === index + 1 && "border-l-2 border-b-2 border-black"
          )}
          onClick={() => handleCategoryClick(index)}
        >
          {name}
        </button>
      ))}
    </div>
  );
};
