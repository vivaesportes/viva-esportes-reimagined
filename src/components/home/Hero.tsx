"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import HeroPhotoCircles from "./HeroPhotoCircles";
import HeroTitle from "./HeroTitle";
import HeroCTA from "./HeroCTA";
import HeroBackground from "./HeroBackground";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5 + i * 0.2,
      ease: [0.25, 0.52, 0.25, 1],
    },
  }),
};

const Hero = () => {
  const whatsappNumber = "5531992901175";
  const whatsappMessage =
    "Olá! Gostaria de saber mais sobre matrículas na Viva Esportes.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const photos = [
    {
      src: "/lovable-uploads/78301558-7861-47ea-9d92-83fa4e88a8ce.png", // futebol, garoto vermelho centralizado
      style: { objectPosition: "60% 40%" }, // Restore original position for the first photo
      alt: "Foto Esporte Garoto Vermelho"
    },
    {
      src: "/lovable-uploads/3da6317e-d0f9-4b9d-897b-2be6b599199a.png", // volei
      style: { objectPosition: "center center" },
      alt: "Foto Esporte Volei"
    },
    {
      src: "/lovable-uploads/05d28d2b-d738-4c5f-95e1-bef71d8408aa.png", // instrutores/alunas, ajustes para mostrar os professores
      style: { objectPosition: "30% 25%" }, // Subir e centralizar mais para mostrar as duas pessoas
      alt: "Foto Esporte Professores"
    },
  ];

  return (
    <section className="relative min-h-[95vh] w-full flex items-center justify-center overflow-hidden bg-[#00030a]">
      <HeroBackground />
      
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 mb-7 md:mb-10 shadow-sm backdrop-blur"
        >
          <Circle className="h-2 w-2 fill-viva-red/80" />
          <span className="text-sm text-viva-yellow tracking-wider font-bold uppercase drop-shadow">
            Viva sua energia!
          </span>
        </motion.div>
        
        <motion.div
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl"
        >
          <HeroTitle />
        </motion.div>

        <HeroPhotoCircles photos={photos} />

        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <p className="text-base sm:text-lg md:text-2xl text-white/85 mb-8 leading-relaxed font-light tracking-wide">
            Descubra mais energia, saúde e diversão em cada treino, torneio e desafio.<br className="hidden md:inline" />
            <span className="text-viva-yellow font-semibold"> Treine, vença, conquiste sua melhor versão com a Viva Esportes!</span>
          </p>
        </motion.div>
        
        <HeroCTA whatsappUrl={whatsappUrl} fadeUpVariants={fadeUpVariants} />
      </div>
    </section>
  );
};

export default Hero;
