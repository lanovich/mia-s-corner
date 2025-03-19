import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn-ui/tooltip";
import { Button } from "../shadcn-ui/button";

interface Props {
  className?: string;
}

export const AboutWishesTooltip: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <div className="translate-x-1/4 -translate-y-1/8 w-3 h-3 bg-gray-400 hover:bg-gray-500 text-white text-[0.5rem] flex items-center justify-center rounded-full select-none">
              ?
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white">
            <p>В этой секции вы можете написать любые пожелания, которые мы сможем исполнить. <br />
              Например: Сделайте подставку из ярко-красного красителя / <br />
              Хочу менее яркий аромат и т.д.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};