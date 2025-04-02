"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export const AboutQuestions = () => {
  return (
    <motion.div className="space-y-6" variants={containerVariants}>
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
        variants={itemVariants}
      >
        Что вы представляете, когда слышите про аромат "Чёрная малина и ваниль"?
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div
          className=" bg-white p-6 md:p-8 rounded-lg shadow-md flex flex-col items-center justify-between"
          variants={itemVariants}
        >
          <p className="text-md md:text-lg text-gray-900 text-center">
            Может, это теплое летнее утро в деревне, где воздух наполнен
            сладостью цветущих лугов?
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-6 md:p-8 rounded-lg shadow-md flex flex-col items-center justify-between"
          variants={itemVariants}
        >
          <p className="text-md md:text-lg text-gray-900 text-center">
            Или, быть может, это история о ней — той самой девушке, которая
            влюбилась в простого парня из соседней деревни?
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-white p-6 md:p-8 rounded-lg shadow-md"
        variants={itemVariants}
      >
        <h4 className="text-xl font-bold text-gray-700 mb-4">
          А что это, если не история?
        </h4>
        <p className="text-lg text-gray-700">
          Каждый наш продукт — это не просто композиция из нот, а маленький мир,
          в который можно погрузиться.
        </p>
      </motion.div>

      <motion.div
        className="bg-white p-6 md:p-8 rounded-lg shadow-md"
        variants={itemVariants}
      >
        <h4 className="text-xl font-bold text-gray-700 mb-4">
          Зачем мы это делаем?
        </h4>
        <p className="text-lg text-gray-700">
          Потому что верим: ароматы — это не просто запахи. Это эмоции, моменты,
          люди и места, которые остаются с нами навсегда. Мы хотим, чтобы каждый
          наш аромат стал частью вашей истории.
        </p>
      </motion.div>
    </motion.div>
  );
};
