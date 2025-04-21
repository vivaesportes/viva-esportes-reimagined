
"use client";

import { motion } from "framer-motion";
import { Circle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Componente visual animado esportivo
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
        y: -120,
        rotate: rotate - 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.2,
        delay,
        ease: [0.25, 0.85, 0.42, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 25, 0],
        }}
        transition={{
          duration: 10,
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
            "backdrop-blur-[1.5px] border-2 border-white/[0.11]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_72%)]"
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
      delay: 0.6 + i * 0.23,
      ease: [0.22, 0.6, 0.25, 1],
    },
  }),
};

const Hero = () => {
  // Dados botão WhatsApp
  const whatsappNumber = "5531992901175";
  const whatsappMessage =
    "Olá! Gostaria de saber mais sobre matrículas na Viva Esportes.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-[#030B1E]">
      {/* Fundo animado geométrico esportivo */}
      <div className="absolute inset-0 bg-gradient-to-br from-viva-blue/70 via-viva-yellow/20 to-viva-red/10 blur-2xl" />
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.2}
          width={520}
          height={140}
          rotate={13}
          gradient="from-viva-yellow/[0.16]"
          className="left-[-12vw] md:left-[-7vw] top-[10%] md:top-[18%]"
        />
        <ElegantShape
          delay={0.5}
          width={420}
          height={120}
          rotate={-12}
          gradient="from-viva-red/[0.18]"
          className="right-[-8vw] md:right-[2vw] top-[67%] md:top-[73%]"
        />
        <ElegantShape
          delay={0.35}
          width={270}
          height={82}
          rotate={-8}
          gradient="from-viva-blue/[0.13]"
          className="left-[7vw] md:left-[12vw] bottom-[3%] md:bottom-[14%]"
        />
        <ElegantShape
          delay={0.5}
          width={190}
          height={60}
          rotate={19}
          gradient="from-viva-yellow/[0.14]"
          className="right-[19vw] md:right-[24vw] top-[11%] md:top-[16%]"
        />
        <ElegantShape
          delay={0.7}
          width={120}
          height={40}
          rotate={-20}
          gradient="from-viva-red/[0.15]"
          className="left-[21vw] md:left-[29vw] top-[6%] md:top-[12%]"
        />
      </div>
      {/* Conteúdo principal: textos esportivos */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Badge esportivo animado */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 mb-8 md:mb-12 shadow-sm backdrop-blur"
          >
            <Circle className="h-2 w-2 fill-viva-red/80" />
            <span className="text-sm text-viva-yellow tracking-wider font-bold uppercase drop-shadow">
              Viva sua energia!
            </span>
          </motion.div>
          {/* Título com animação gradient esportiva */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-5 md:mb-8 tracking-tight leading-tight drop-shadow-lg">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-viva-yellow via-white to-viva-yellow/70">
                Esporte.{" "}
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-viva-blue/90 via-viva-red/90 to-viva-yellow/80 animate-[pulse_7s_ease-in-out_infinite]">
                Movimento. Vitória.
              </span>
            </h1>
          </motion.div>
          {/* Subtítulo com animação */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-2xl text-white/80 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto">
              Descubra mais energia, saúde e diversão a cada treino, torneio e desafio. Treine, vença, conquiste sua melhor versão com a Viva Esportes!
            </p>
          </motion.div>
          {/* Botões de ação */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-5 justify-center w-full mb-2"
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
              className="border-white text-white font-bold px-9 py-5 rounded-full hover-scale transition-all text-lg hover:bg-viva-blue/20 bg-white/10 flex items-center justify-center gap-3"
            >
              <Link to="/modalidades">
                Modalidades &nbsp; <span className="inline-block animate-bounce">🏅</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
      {/* Degrade de overlay para dar profundidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030B1E] via-transparent to-[#030B1E]/65 pointer-events-none" />
    </section>
  );
};

export default Hero;
