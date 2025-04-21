"use client";

import { motion } from "framer-motion";
import { Circle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import HeroPhotoCircles from "./HeroPhotoCircles";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.09]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.2,
        delay,
        ease: [0.25, 0.85, 0.41, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 18, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_40px_0_rgba(0,0,0,0.17)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_63%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

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
      style: { objectPosition: "center 40%" },
      alt: "Foto Esporte Garoto Vermelho"
    },
    {
      src: "/lovable-uploads/3da6317e-d0f9-4b9d-897b-2be6b599199a.png", // volei
      style: { objectPosition: "center center" },
      alt: "Foto Esporte Volei"
    },
    {
      src: "/lovable-uploads/05d28d2b-d738-4c5f-95e1-bef71d8408aa.png", // instrutores/alunas, ajustes para mostrar os professores
      style: { objectPosition: "center 50%" },
      alt: "Foto Esporte Professores"
    },
  ];

  return (
    <section className="relative min-h-[95vh] w-full flex items-center justify-center overflow-hidden bg-[#00030a]">
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-viva-blue/20 to-viva-darkBlue/80 blur-3xl" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.25}
          width={640}
          height={160}
          rotate={14}
          gradient="from-viva-yellow/[0.14]"
          className="left-[-12vw] md:left-[-10vw] top-[8%] md:top-[14%]"
        />
        <ElegantShape
          delay={0.4}
          width={480}
          height={130}
          rotate={-13}
          gradient="from-viva-red/[0.22]"
          className="right-[-7vw] md:right-[-2vw] top-[71%] md:top-[76%]"
        />
        <ElegantShape
          delay={0.38}
          width={340}
          height={80}
          rotate={-8}
          gradient="from-viva-blue/[0.12]"
          className="left-[12vw] md:left-[17vw] bottom-[7%] md:bottom-[17%]"
        />
        <ElegantShape
          delay={0.55}
          width={180}
          height={60}
          rotate={17}
          gradient="from-viva-yellow/[0.13]"
          className="right-[17vw] md:right-[21vw] top-[15%] md:top-[19%]"
        />
        <ElegantShape
          delay={0.6}
          width={125}
          height={42}
          rotate={-27}
          gradient="from-viva-red/[0.17]"
          className="left-[27vw] md:left-[33vw] top-[5%] md:top-[11%]"
        />
      </div>
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
          <h1 className="text-4xl sm:text-7xl md:text-8xl font-extrabold mb-5 md:mb-10 tracking-tighter leading-tight drop-shadow-xl text-white select-none">
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
        <motion.div
          custom={4}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-5 justify-center w-full mb-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-viva-yellow to-viva-red text-viva-darkBlue font-bold px-9 py-5 rounded-full shadow-xl hover:scale-105 transition-all text-lg border-2 border-white hover:border-viva-red hover:bg-viva-red hover:text-white"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Matricule-se agora
              <ArrowRight className="inline-block ml-2" size={22} />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white font-bold px-9 py-5 rounded-full hover-scale transition-all text-lg hover:bg-viva-blue/25 bg-white/10 flex items-center justify-center gap-3"
          >
            <Link to="/modalidades">
              Modalidades <span className="inline-block animate-bounce">🏅</span>
            </Link>
          </Button>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#01010a] via-transparent to-[#01010a]/80 pointer-events-none" />
    </section>
  );
};

export default Hero;
