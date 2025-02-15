import { cn } from "@/libs";
import Image from "next/image";
import React from "react";

interface Props {
  className?: string;
  description?: string;
  heading?: string;
  link?: string;
}

export const AboutSection: React.FC<Props> = ({ className, description, heading, link }) => {
  return (
    <section
      className={cn(
        "mx-auto max-w-[1400px] px-6 py-16 md:flex md:items-center",
        className
      )}
    >
      {/* Левая часть с текстом */}
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold">{heading}</h2>
        <p className="mt-4 text-lg text-gray-700">
          {description}
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-black hover:text-red-500 transition">
          <span className="text-red-500">→</span>
          <a href="#" className="border-b border-black hover:border-red-500">
            {link}
          </a>
        </div>
      </div>

      {/* Правая часть с картинками */}
      <div className="relative mt-10 flex md:mt-0 md:w-1/2">
        {/* Верхнее изображение */}
        <div className="absolute top-0 right-20 w-[250px] h-[150px] md:w-[300px] md:h-[180px] overflow-hidden shadow-lg">
          
        </div>

        {/* Нижнее изображение (основное) */}
        <div className="ml-auto w-[400px] h-[250px] md:w-[500px] md:h-[300px] overflow-hidden shadow-xl">
          
        </div>
      </div>
    </section>
  );
};
