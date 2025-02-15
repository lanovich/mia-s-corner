import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
  cats: any[];
  count: number;
  current: number;
  handleCategoryClick: (index: number) => void;
}

export const ProductCategories: React.FC<Props> = ({
  className,
  cats,
  current,
  handleCategoryClick,
}) => {
  return (
    <div
      className={cn(
        "inline-flex gap-7 overflow-hidden mx-auto w-full justify-center",
        className
      )}
    >
      {cats.map(({ id, name }, index) => (
        <button
          className={cn(
            "box-border items-center font-bold my-5 px-[2px] gap-10 rounded-none relative",
            current === index + 1 &&
              "border-l-2 border-b-2 border-black"
          )}
          key={index}
        >
          {name}
        </button>
      ))}
    </div>
  );
};
