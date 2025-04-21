
import { motion } from "framer-motion";

interface HeroTitleProps {
  className?: string;
}

const HeroTitle = ({ className }: HeroTitleProps) => {
  return (
    <h1 className={`text-4xl sm:text-7xl md:text-8xl font-extrabold mb-5 md:mb-10 tracking-tighter leading-tight drop-shadow-xl text-white select-none ${className}`}>
      <motion.span
        initial={{ opacity: 0, x: -90 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.75, duration: 0.8, type: "spring", stiffness: 60 }}
        className="block text-white"
      >
        Esporte.
      </motion.span>
      <motion.span
        initial={{ opacity: 0, x: 120 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8, type: "spring", stiffness: 50 }}
        className="block text-white"
      >
        Movimento.
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.85, type: "spring", stiffness: 54 }}
        className="block text-white"
      >
        Vitória.
      </motion.span>
    </h1>
  );
};

export default HeroTitle;
