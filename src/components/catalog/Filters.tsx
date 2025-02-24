import React from "react";
import { Button } from "../shadcn-ui/button";

const groupColors: Record<string, string> = {
  Фруктовые: "bg-orange-300",
  Древесные: "bg-green-400",
  Цветочные: "bg-pink-300",
  Пряные: "bg-yellow-300",
  Цитрусовые: "bg-yellow-300",
  Сладкие: "bg-red-300",
  Зелёные: "bg-green-200",
  Восточные: "bg-gray-300"
};

interface FiltersProps {
  smells: Record<string, string[]>;
}

export const Filters: React.FC<FiltersProps> = ({ smells }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-5">
      {Object.entries(smells).flatMap(([group, groupSmells]) =>
        groupSmells.map((smell) => (
          <Button
            key={smell}
            className={`text-black px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-opacity-75 transition ${
              groupColors[group] || "bg-gray-100"
            }`}
          >
            {smell}
          </Button>
        ))
      )}
    </div>
  );
};
