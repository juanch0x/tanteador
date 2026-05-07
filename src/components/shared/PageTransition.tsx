import { createContext, useContext } from "react";
import { motion } from "framer-motion";

const variants = {
  initial: (dir: number) => ({
    x: dir * 48,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.22,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: (dir: number) => ({
    x: dir * -48,
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  }),
};

export const DirectionContext = createContext(1);

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const dir = useContext(DirectionContext);
  return (
    <motion.div
      custom={dir}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};
