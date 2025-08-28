"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib";

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const LoadingLink: React.FC<LoadingLinkProps> = ({
  href,
  children,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <Link
      href={href}
      className={cn(
        "relative block w-full h-full overflow-hidden",
        className
      )}
      onClick={handleClick}
    >
      {/* Серый фон */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
          {/* Индикатор загрузки */}
          <Loader2 className="w-8 h-8 animate-spin text-white" />{" "}
          {/* Увеличенный размер */}
        </div>
      )}

      {/* Дочерние элементы (контент ссылки) */}
      {children}
    </Link>
  );
};
