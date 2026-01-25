import { Variants } from "framer-motion";

export const slideUp: Variants = {
  initial: {
    y: 0,
  },
  enter: {
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    y: "-100%",
    transition: {
      duration: 0.6,
      ease: "easeIn",
    },
  },
};

export const opacity: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};
