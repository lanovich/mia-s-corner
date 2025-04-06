"use client";

import { cn } from "@/lib";
import Link from "next/link";
import { useState } from "react";
import { Hexagon } from "lucide-react";

interface Props {
  href: string;
  label: string;
  target?: string;
  className?: string;
}

export const GoToButton: React.FC<Props> = ({
  href,
  label,
  className,
  target,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleInternalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    window.location.href = href;
  };

  if (target === "_blank") {
    return (
      <div className="flex">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-lg inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-6 min-w-[160px]",
            className
          )}
        >
          {label}
        </a>
      </div>
    );
  }

  return (
    <div className="flex">
      <Link
        href={href}
        onClick={handleInternalClick}
        className={cn(
          `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-6 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`,
          "min-w-[160px]",
          className
        )}
      >
        {isLoading ? <Hexagon className="animate-spin" /> : label}
      </Link>
    </div>
  );
};
