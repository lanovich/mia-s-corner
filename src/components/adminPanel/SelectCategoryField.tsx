"use client";

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcn-ui/select";
import { useAdminStore } from "@/store/useAdminStore";
import { CategoryOption } from "@/types";

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
  const [searchTerm, setSearchTerm] = useState("");
  const { setSelectedCategory } = useAdminStore();

  const filteredOptions = options.filter(
    (option) =>
      option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.compound?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectChange = async (id: string) => {
    const selected = options.find((opt) => opt.id.toString() === id);
    if (selected) {
      setSelectedCategory(selected);
    }
  };

  return (
    <div className={className}>
      <p className="text-gray-500 text-sm mb-2">Категория, количество</p>
      <Select value={value?.id.toString()} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выбери категорию"></SelectValue>
        </SelectTrigger>

        <SelectContent>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id.toString()}
                  className="cursor-pointer"
                >
                  <div className="flex gap-10">
                    <div className="text-sm font-medium">
                      кол-во:{" "}
                      {(Number(category.quantity) < 10
                        ? `0${category.quantity}`
                        : category.quantity) ?? 0}
                    </div>
                    <div className="font-medium">{category.title}</div>
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
