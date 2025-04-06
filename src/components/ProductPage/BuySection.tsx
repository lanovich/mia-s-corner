"use client";

import React, { useState } from "react";
import { SizeAndBuy } from "./SizeAndBuy";
import { cn } from "@/lib";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  className?: string;
  productCompound?: string;
  productEpsiodeId?: number;
  productEpisode?: string | null;
  productTitle: string;
  measure: string;
  sizes: ProductSize[];
}

export const BuySection: React.FC<Props> = ({
  className,
  productCompound,
  productEpsiodeId,
  productEpisode,
  measure,
  productTitle,
  sizes,
}) => {
  const [expanded, setExpanded] = useState(true);

  const formattedEpisode = productEpisode?.replace(/\n/g, "\n");

  return (
    <div
      className={cn(
        "flex flex-col gap-4 bg-slate-100 rounded-lg py-4 px-4 flex-1",
        className
      )}
    >
      <h1 className="text-2xl font-semibold border-b-2 pb-2 border-neutral-200">
        {productTitle}
      </h1>
      {productCompound && (
        <p className="text-gray-500">Аромат: {productCompound}</p>
      )}
      {productEpisode && (
        <>
          <h2 className="text-xl font-semibold">Эпизод #{productEpsiodeId}</h2>
          <div className="relative">
            <p
              className={cn(
                "border-b-2 pb-3 border-neutral-200 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out whitespace-pre-wrap",
                expanded ? "max-h-[500rem]" : "max-h-12"
              )}
              onClick={() => setExpanded(!expanded)}
            >
              {formattedEpisode}
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
        <SizeAndBuy sizes={sizes} measure={measure} />
      </div>
    </div>
  );
};
