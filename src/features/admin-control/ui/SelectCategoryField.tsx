"use client";

import React, { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/shadcn-ui/select";
import { useAdminStore } from "@/features/admin-control/model/useAdminStore";
import { CategoryOption } from "@/entities/category/model";

interface SelectCategoryFieldProps {
  className?: string;
  value?: CategoryOption;
  options?: CategoryOption[];
}

export const SelectCategoryField: React.FC<SelectCategoryFieldProps> = ({
  className,
  value,
  options = [],
}) => {
  const { setSelectedCategory, selectedCategory } = useAdminStore();

  useEffect(() => {
    if (options.length > 0 && !selectedCategory) {
      setSelectedCategory(options[0]);
    }
  }, [options, selectedCategory, setSelectedCategory]);

  const handleSelectChange = async (id: string) => {
    const selected = options.find((opt) => opt.id.toString() === id);
    if (selected) {
      setSelectedCategory(selected);
    }
  };

  const currentValue =
    value?.id.toString() ||
    selectedCategory?.id.toString() ||
    (options.length > 0 ? options[0].id.toString() : undefined);

  return (
    <div className={className}>
      <Select value={currentValue} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выбери категорию">
            {selectedCategory?.name ||
              (options.length > 0 ? options[0].name : "Выбери категорию")}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <div className="max-h-[300px] overflow-y-auto">
            {options.length > 0 ? (
              options.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id.toString()}
                  className="cursor-pointer"
                >
                  <div className="flex gap-10">
                    <div className="text-sm font-medium">
                      кол-во: {category.stockQuantity}
                    </div>
                    <div className="font-medium">{category.name}</div>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Товары не найдены
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};
