import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  className?: string;
}

export const NewCollection: React.FC<Props> = ({ className }) => {
  return (
    <div className={`relative flex h-[80vh] flex-col bg-gradient-to-b from-gray-50 to-gray-200 p-6 text-center ${className}`}>
      {/* Декоративные элементы */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-red-300 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-300 rounded-full opacity-30 blur-3xl"></div>

      {/* Текст */}
      <h2 className="m-auto mt-10 text-center font-bold text-4xl sm:text-5xl md:text-6xl text-gray-800 z-20">
        Откройте новую коллекцию
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 z-30">
        Окунитесь в мир ароматов с нашей новой серией эксклюзивных свечей, созданных с любовью.
      </p>

      {/* Изображения */}
      <div className="relative flex flex-wrap justify-center items-end gap-6 mt-10">
        <Image
          src="/Imbir.svg"
          alt="банка 1"
          width={200}
          height={200}
          className="transition-transform duration-300 hover:scale-110 z-30 drop-shadow-lg"
          priority
        />
        <Image
          src="/Imbir.svg"
          alt="банка 2"
          width={260}
          height={200}
          className="transition-transform duration-300 hover:scale-110 z-40 drop-shadow-lg"
          priority
        />
        <Image
          src="/Imbir.svg"
          alt="банка 3"
          width={200}
          height={200}
          className="transition-transform duration-300 hover:scale-110 z-30 drop-shadow-lg"
          priority
        />
      </div>

      {/* Кнопка */}
      <div className="relative mt-10 flex justify-center md:justify-end md:pr-10">
        <Link href="/collection">
          <button className="rounded-full bg-black px-8 py-3 text-lg font-medium text-white transition-all duration-300 hover:bg-gray-800 shadow-lg">
            Перейти к коллекции
          </button>
        </Link>
      </div>
    </div>
  );
};
