"use client";

import { useState } from "react";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";

const products = [
  { id: 1, name: "Ароматическая свеча 'Лаванда'", price: 1200, quantity: 1 },
  { id: 2, name: "Диффузор 'Ваниль и Бергамот'", price: 1800, quantity: 1 },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const totalPrice = useCartStore((state) => state.totalAmount)
  const products = useCartStore((state) => state.cart);
  console.log(products);

  return (
    <div className="min-h-screen bg-white text-black py-10 px-4 md:px-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold border-b pb-4 mb-6">
          Оформление заказа
        </h1>

        {/* Список товаров */}
        <div className="mb-6">
          {products.map(({ product, quantity }) => (
            <Card key={product.id} className="mb-3 border-gray-300">
              <CardContent className="flex justify-between py-3">
                <div>
                  <span>{product.title}</span>
                  <span className="text-xs ml-5 text-gray-300">
                    {product.price} * {quantity}
                  </span>
                </div>
                <span className="font-medium">
                  {product.price * quantity} ₽
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Контактные данные */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Контактные данные</h2>
          <Input className="mb-3" placeholder="Ваше имя" />
          <Input className="mb-3" placeholder="Телефон" type="tel" />
          <Input className="mb-3" placeholder="Адрес доставки" />
        </div>

        {/* Способы оплаты */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Способ оплаты</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={() => setPaymentMethod("transfer")}
              />
              <span>Перевод на карту</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <span>Оплата при получении</span>
            </label>
          </div>
        </div>

        <div className="border-gray-300 border-y flex justify-between my-5 py-5">
          <h1 className="text-2xl font-medium mb-3">Итого</h1>
          <p className="text-2xl font-semibold pb-4">{totalPrice} ₽</p>
        </div>

        {/* Кнопка подтверждения */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="w-full bg-black text-white py-3 rounded-lg">
            Оформить заказ
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
