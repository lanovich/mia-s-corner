"use client";

import React, { useState } from "react";
import { SizeAndBuy } from "./SizeAndBuy";
import { cn } from "@/lib";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MobileSizeAndBuy } from "./MobileSizeAndBuy";

interface Props {
  className?: string;
  productCompound?: string;
  productHistoryId?: number;
  productEpisode?: string | null;
  productTitle: string;
  sizes: Size[];
}

export const BuySection: React.FC<Props> = ({
  className,
  productCompound,
  productHistoryId,
  productEpisode,
  productTitle,
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
        {productTitle}
      </h1>
      {productCompound && (
        <p className="text-gray-500">Аромат: {productCompound}</p>
      )}
      {productEpisode && (
        <>
          <h2 className="text-xl font-semibold">Эпизод #{productHistoryId}</h2>
          <div className="relative">
            <p
              className={cn(
                "border-b-2 pb-3 border-neutral-200 cursor-pointer overflow-hidden transition-all duration-50 ease-in-out",
                expanded ? "max-h-[30rem] opacity-100" : "max-h-10 opacity-80"
              )}
              onClick={() => setExpanded(!expanded)}
            >
              {productEpisode}
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
        <SizeAndBuy sizes={sizes} />
      </div>
    </div>
  );
};
