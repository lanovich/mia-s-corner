"use client";

import { useState } from "react";
import { Button } from "@/shared/shadcn-ui";
import { cn } from "@/shared/lib";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Модалка */}
      <div
        className={cn(
          "relative w-full max-w-lg rounded-xl shadow-xl p-6",
          "glassy-bg animate backdrop-blur-xl",
          "bg-white/70 dark:bg-neutral-900/70"
        )}
      >
        <h1 className="text-2xl font-bold text-red-600 mb-2 text-center">
          Что-то пошло не так 😢
        </h1>

        <p className="text-center text-black/60 dark:text-white/60 mb-4">
          В приложении произошла ошибка. Попробуйте обновить страницу или
          повторить действие.
        </p>

        <div className="flex justify-center mb-3">
          <Button
            variant={"ghost"}
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Скрыть детали" : "Показать детали"}
          </Button>
        </div>

        {showDetails && (
          <pre className="bg-black/10 dark:bg-white/10 text-xs p-4 rounded-md overflow-auto max-h-60 whitespace-pre-wrap text-red-600">
            {error.message}
          </pre>
        )}

        <div className="flex gap-3 mt-6 justify-center">
          <Button variant="default" onClick={() => reset()}>
            Попробовать снова
          </Button>

          <Button
            variant="destructive"
            onClick={() => window.location.reload()}
          >
            Перезагрузить страницу
          </Button>
        </div>

        <div className="absolute inset-0 pointer-events-none border border-black/10 rounded-xl"></div>
      </div>
    </div>
  );
}
