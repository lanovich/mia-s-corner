"use client";

import React, { useState } from "react";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/shadcn-ui/select";
import { Input } from "@/components/shadcn-ui/input";
import { useAdminStore } from "@/store/useAdminStore";
import { ProductOption } from "@/entities/product/model";

interface SelectProductFieldProps {
  className?: string;
  value?: ProductOption;
  options?: ProductOption[];
}

export const SelectProductField: React.FC<SelectProductFieldProps> = ({
  className,
  value,
  options = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { setSelectedProduct } = useAdminStore();

  const filteredOptions = options.filter(
    (option) =>
      option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.compound?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectChange = async (id: string) => {
    const selected = options.find((opt) => opt.id.toString() === id);
    if (selected) {
      setSelectedProduct(selected);
    }
  };

  return (
    <div className={className}>
      <Select value={value?.id.toString()} onValueChange={handleSelectChange}>
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
                  <div className="flex gap-10">
                    <div className="text-sm font-medium">
                      кол-во: {(Number(product.quantity) < 10 ? `0${product.quantity}` : product.quantity) ?? 0}
                    </div>
                    <div className="font-medium">{product.title}</div>
                    {product.compound && (
                      <div className="text-sm text-gray-500">
                        {product.compound}
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
