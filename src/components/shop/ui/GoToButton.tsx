"use client";

import { cn } from "@/lib";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  href: string;
  label: string;
  className?: string;
}

export const GoToButton: React.FC<Props> = ({ href, label, className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <div className="flex">
      <Link
        href={href}
        onClick={handleClick}
        className={cn(
          `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-6 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`,
          "min-w-[160px]",
          className
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
          </>
        ) : (
          label
        )}
      </Link>
    </div>
  );
};
