"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./style.module.scss";
import { opacity, slideUp } from "./anim";

type PreloadsProps = {
  pageName: string;
  onComplete: () => void;
};

export default function Preloads({ pageName, onComplete }: PreloadsProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
