"use client";

import React, { useState } from "react";
import { SizeAndBuy } from "./SizeAndBuy";
import { cn } from "@/shared/lib";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ProductSize } from "@/entities/product/model";

interface Props {
  className?: string;
  scent?: string;
  episodeId?: number;
  episodeText?: string | null;
  title: string;
  unit: string;
  sizes: ProductSize[];
}

export const BuySection: React.FC<Props> = ({
  className,
  scent,
  episodeId,
  episodeText,
  title,
  unit,
  sizes,
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 bg-slate-100 rounded-lg py-4 px-4 flex-1",
        className
      )}
    >
      <h1 className="text-2xl font-semibold border-b-2 pb-2 border-neutral-200">
        {title}
      </h1>

      {scent && <p className="text-gray-500">Аромат: {scent}</p>}

      {episodeText && (
        <>
          <h2 className="text-xl font-semibold">Эпизод #{episodeId}</h2>
          <div className="relative">
            <p
              className={cn(
                "border-b-2 pb-3 border-neutral-200 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out whitespace-pre-wrap",
                expanded ? "max-h-[500rem]" : "max-h-12"
              )}
              onClick={() => setExpanded(!expanded)}
            >
              {episodeText}
            </p>
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-inherit z-20">
              <button onClick={() => setExpanded(!expanded)}>
                {expanded ? <ChevronUp /> : <ChevronDown />}
              </button>
            </span>
          </div>
        </>
      )}

      <div className="hidden md:flex">
        <SizeAndBuy sizes={sizes} unit={unit} />
      </div>
    </div>
  );
};
