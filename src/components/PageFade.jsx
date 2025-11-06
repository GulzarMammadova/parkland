import React from "react";
import { motion } from "motion/react";

export function PageFade({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } }}
      style={{ minHeight: "100vh" }}   // чтобы высота не «скакала» на переходе
    >
      {children}
    </motion.main>
  );
}
