"use client";

import React from "react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export const AboutHeader = () => {
  return (
    <motion.h1
      className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      О нас
    </motion.h1>
  );
};
