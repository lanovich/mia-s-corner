"use client";

import React from "react";
import { motion } from "framer-motion";

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

interface Props {
  fragrances: {
    title: string;
    story: string;
    image: string;
  }[];
}

export const AboutContent: React.FC<Props> = ({ fragrances }) => {
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.p
        className="text-lg md:text-xl text-gray-700 mb-6"
        variants={itemVariants}
      >
        Каждый аромат — часть истории. Названия связаны между собой,
        создавая единую линию повествования, которую каждый понимает по своему.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        variants={containerVariants}
      >
        {fragrances.map(({ title, story, image }, index) => (
          <motion.div
            key={index}
            className="flex flex-col p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
              {title}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{story}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
