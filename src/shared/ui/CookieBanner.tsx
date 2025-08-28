"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isCookieAccepted = localStorage.getItem("cookiesAccepted");
    if (isCookieAccepted !== "true") {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 max-w-md bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
      <p className="text-sm text-gray-700 mb-2">
        Мы используем <strong>обязательные</strong> cookies для работы корзины.
        При оформлении заказа мы обрабатываем ваши email, телефон и адрес для
        выполнения заказа. Подробнее в{" "}
        <Link href="/privacy" className="text-blue-600 hover:underline">
          Политике конфиденциальности
        </Link>
        .
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={acceptCookies}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
        >
          Понятно
        </button>
      </div>
    </div>
  );
};
