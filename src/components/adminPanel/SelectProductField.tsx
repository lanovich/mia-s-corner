"use client";

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcn-ui/select";
import { Input } from "@/components/shadcn-ui/input";

interface ProductOption {
  id: number;
  title: string;
  compound: string;
  quantity?: number;
}

interface SelectProductFieldProps {
  className?: string;
  value?: ProductOption;
  onChange?: (product: ProductOption) => void;
  options?: ProductOption[];
}

export const SelectProductField: React.FC<SelectProductFieldProps> = ({
  className,
  value,
  onChange,
  options = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(
    (option) =>
      option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.compound?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={className}>
      <p className="text-gray-500 text-sm mb-2">Название, аромат, количество</p>
      <Select
        value={value?.id.toString()}
        onValueChange={(id: string) => {
          const selected = options.find((opt) => opt.id.toString() === id);
          if (selected) {
            onChange?.(selected);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выбери продукт"></SelectValue>
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
                  <div className="flex gap-20">
                      <div className="font-medium">{product.title}</div>
                      {product.compound && (
                        <div className="text-sm text-gray-500">
                          {product.compound}
                        </div>
                      )}
                    <div className="text-sm font-medium">
                      кол-во: {product.quantity ?? 0}
                    </div>
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
