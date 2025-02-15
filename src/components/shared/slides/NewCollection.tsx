import React from "react";
import Image from "next/image";

interface Props {
  className?: string;
}

export const NewCollection: React.FC<Props> = ({ className }) => {
  return (
    <>
      {/* Первый слайд */}
      <div className="relative flex h-[75vh] flex-col bg-slate-100 p-1 text-center">
        {/* Фон */}
        <div className="absolute left-1/3 -top-[350px] h-[1300px] w-[400px] rotate-45 overflow-hidden bg-slate-200 z-10"></div>

        {/* Текст */}
        <h2 className="m-auto mt-5 text-center font-semibold text-[calc(40px+8*(100vw-320px)/880)] z-20">
          Встречайте новую коллекцию историй
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-md z-30">
          Однажды Эрнест Хемингуэй поспорил...
        </p>

        {/* Изображения */}
        <div className="flex flex-wrap justify-center items-end gap-5 mt-6">
          <Image
            src={"/Imbir.svg"}
            alt={"банка 1"}
            width={250}
            height={250}
            className="transition delay-150 duration-150 ease-in-out hover:scale-110 z-30"
          />
          <Image
            src={"/Imbir.svg"}
            alt={"банка 2"}
            width={350}
            height={250}
            className="transition delay-150 duration-150 ease-in-out hover:scale-110 z-40"
          />
          <Image
            src={"/Imbir.svg"}
            alt={"банка 3"}
            width={250}
            height={250}
            className="transition delay-150 duration-150 ease-in-out hover:scale-110 z-30"
          />
        </div>

        <div className="flex flex-grow items-center justify-center">
          <button className="rounded-full border border-black px-6 py-2 text-black bg-transparent hover:bg-black hover:text-white transition z-50">
            Перейти к коллекции
          </button>
        </div>
      </div>
    </>
  );
};
