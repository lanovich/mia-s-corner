"use client";

import React from "react";
import { Input } from "@/shared/shadcn-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/shadcn-ui/select";
import { CATEGORY_SLUG_MAP } from "@/entities/category/model";
import { cn } from "@/shared/lib";

interface Props {
  query: string;
  setQuery: (q: string) => void;
  category: string | undefined;
  setCategory: (c: string) => void;
  className?: string;
}

export const SearchInput: React.FC<Props> = ({
  query,
  setQuery,
  category,
  setCategory,
  className,
}) => {
  const handleValueChange = (value: string) => {
    setCategory(value || "all");
  };

  return (
    <div className={cn("flex gap-1 items-center", className)}>
      <Input
        placeholder="Поиск товаров..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-[340px] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2 "
      />

      <Select value={category ?? "all"} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[130px] bg-black text-white focus:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2">
          <SelectValue placeholder="по всем" />
        </SelectTrigger>
        <SelectContent className="bg-black text-white">
          <SelectItem value={"all"}>по всем</SelectItem>
          {Object.entries(CATEGORY_SLUG_MAP).map(([slug, name]) => (
            <SelectItem key={slug} value={slug} className="hover:bg-gray-700">
              {name.split(" ").at(-1)?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
