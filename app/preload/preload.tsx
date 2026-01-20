"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./style.module.scss";
import { opacity, slideUp } from "./anim";

type PreloadsProps = {
  pageName: string;
  onComplete: () => void;
};

export default function Preloads({ pageName, onComplete }: PreloadsProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className={styles.introduction}
      variants={slideUp}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <motion.p variants={opacity} initial="initial" animate="enter">
        <span></span>
        {pageName}
      </motion.p>
    </motion.div>
  );
}
