"use client";

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/shadcn-ui/select";
import { Input } from "@/shared/shadcn-ui";
import { useAdminStore } from "@/features/admin-control/model/useAdminStore";
import { Category } from "@/entities/category/model";

export interface ProductOption {
  id: number;
  title: string;
  scentName?: string | null;
  quantity: number;
  categoryInfo: Category;
}

interface SelectProductFieldProps {
  className?: string;
  value?: ProductOption;
  options: ProductOption[] | null;
}

export const SelectProductField: React.FC<SelectProductFieldProps> = ({
  className,
  value,
  options = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { setSelectedProductOption } = useAdminStore();

  if (!options) return <div>Не смогли получитт варианты</div>;

  const filteredOptions = options.filter((option) => {
    const term = searchTerm.toLowerCase();

    return (
      option.title.toLowerCase().includes(term) ||
      option.scentName?.toLowerCase().includes(term)
    );
  });

  const handleSelectChange = async (id: string) => {
    const selected = options.find((opt) => opt.id.toString() === id);
    if (selected) {
      setSelectedProductOption(selected);
    }
  };

  return (
    <div className={className}>
      <Select value={value?.id.toString()} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выбери продукт" />
        </SelectTrigger>

        <SelectContent>
          <div className="p-2 border-b">
            <Input
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((product) => (
                <SelectItem
                  key={product.id}
                  value={product.id.toString()}
                  className="cursor-pointer"
                >
                  <div className="flex gap-10">
                    <div className="text-sm font-medium">
                      кол-во:
                      {product.quantity < 10
                        ? `0${product.quantity}`
                        : product.quantity}
                    </div>

                    <div className="font-medium">{product.title}</div>

                    {product.scentName && (
                      <div className="text-sm text-gray-500 truncate max-w-[400px]">
                        {product.scentName}
                      </div>
                    )}
                    {product.categoryInfo.name && (
                      <div className="text-sm text-gray-500 truncate max-w-[400px]">
                        {product.categoryInfo.name}
                      </div>
                    )}
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
