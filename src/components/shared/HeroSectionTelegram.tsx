import React from "react";

interface Props {
  className?: string;
}

export const HeroSectionTelegram: React.FC<Props> = ({ className }) => {
  return (
    <div className={`${className} relative flex flex-col items-center justify-center h-[80vh] bg-gradient-to-b from-blue-100 to-blue-300 text-center px-6 overflow-hidden`}>
      {/* Декоративный фон */}
      <div className="absolute inset-0 flex justify-center items-center opacity-20">
        {/* Бумажные самолетики */}
        <div className="absolute top-10 left-10 w-10 h-10 rotate-12 opacity-50 text-2xl">
          ✈️
        </div>
        <div className="absolute top-20 right-16 w-10 h-10 -rotate-6 opacity-60 text-2xl">
          ✈️
        </div>
        <div className="absolute bottom-16 left-1/3 w-14 h-14 rotate-3 opacity-40 text-2xl">
          ✈️
        </div>
        <div className="absolute bottom-8 right-20 w-12 h-12 -rotate-8 opacity-50 text-2xl">
          ✈️
        </div>
      </div>

      {/* Контент */}
      <h2 className="relative z-10 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl text-blue-900">
        Мы теперь в Telegram!
      </h2>
      <p className="relative z-10 mt-4 max-w-lg text-lg text-gray-800">
        Подписывайтесь на наш канал, чтобы быть в курсе новостей, акций и специальных предложений!
      </p>

      {/* Кнопка */}
      <div className="relative z-10 mt-6">
        <a
          href="https://t.me/mias_corner"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-blue-600 px-6 py-3 text-white text-lg font-medium transition-all duration-300 hover:bg-blue-700 shadow-lg"
        >
          Подписаться в Telegram
        </a>
      </div>
    </div>
  );
};
