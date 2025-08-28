"use client";

import { cn } from "@/lib";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface EpisodeBlockProps {
  episodeNumber: number;
  episodeText: string | null;
  compound?: string;
}

export const EpisodeBlock: React.FC<EpisodeBlockProps> = ({
  episodeNumber,
  episodeText,
  compound,
}) => {
  const [expanded, setExpanded] = useState(true);

  const formattedText = episodeText?.replace(/\n/g, '\n');

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold">Эпизод {episodeNumber}</h2>

      {/* Текст эпизода с возможностью разворачивания */}
      <div className="relative">
        <p
          className={cn(
            "border-b-2 pb-3 border-neutral-200 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out whitespace-pre-wrap",
            expanded ? "max-h-[500rem]" : "max-h-12"
          )}
          onClick={() => setExpanded(!expanded)}
        >
          {formattedText}
        </p>

        {/* Кнопка для разворачивания/сворачивания */}
        <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-inherit z-20">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 bg-inherit rounded-full hover:bg-inherit transition-colors"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </span>
      </div>

      {/* Аромат (с эффектом blur) */}
      {compound && (
        <p className="mt-1 text-lg font-bold w-fit text-gray-700">{compound}</p>
      )}
    </div>
  );
};
