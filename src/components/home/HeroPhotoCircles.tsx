
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PhotoCircle {
  src: string;
  style?: React.CSSProperties;
  alt: string;
}

interface HeroPhotoCirclesProps {
  photos: PhotoCircle[];
}

const HeroPhotoCircles = ({ photos }: HeroPhotoCirclesProps) => {
  return (
    <motion.div
      custom={2}
      initial="hidden"
      animate="visible"
      className="flex gap-8 justify-center mb-12 mt-4"
    >
      {photos.map(({ src, style, alt }, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 1.6 + i * 0.28,
            duration: 0.85,
            ease: [0.23, 0.7, 0.45, 1],
          }}
          className="shadow-2xl"
        >
          <img
            src={src}
            alt={alt}
            style={i === 1
              // Destaque círculo do meio
              ? { ...style, boxShadow: "0 0 0 8px rgba(255, 223, 71, 0.35)" }
              : style}
            className={cn(
              "w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-viva-yellow shadow-lg bg-black/30",
              "hover:scale-105 transition duration-300"
            )}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default HeroPhotoCircles;
