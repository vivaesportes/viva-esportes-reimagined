
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Hero animations variants
const titleVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 1 } },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, type: "spring", duration: 1 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.4, type: "spring", duration: 0.8 },
  },
};

const imgVariants = {
  hidden: { opacity: 0, x: 70, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: 0.25, type: "spring", duration: 1.2 },
  },
};

const Hero = () => {
  // Dados para o botão Matricule-se
  const whatsappNumber = "5531992901175";
  const whatsappMessage = "Olá! Gostaria de saber mais sobre matrículas na Viva Esportes.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Animação para as bolhas do fundo esportivo
  const bubbles = [
    { style: "left-8 top-10", color: "bg-viva-blue", opacity: "opacity-20", size: "w-40 h-40", delay: 0 },
    { style: "right-4 bottom-24", color: "bg-viva-red", opacity: "opacity-20", size: "w-28 h-28", delay: 0.5 },
    { style: "left-1/2 top-1/4", color: "bg-viva-yellow", opacity: "opacity-30", size: "w-56 h-56", delay: 1 },
    { style: "right-1/3 top-1/2", color: "bg-white", opacity: "opacity-10", size: "w-64 h-64", delay: 0.7 },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-tr from-viva-blue via-viva-yellow/10 to-viva-darkBlue select-none">
      {/* Fundo Esportivo: Gradientes, bolhas dinâmicas e faixas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Bolhas esportivas */}
        {bubbles.map((bubble, idx) => (
          <motion.div
            key={idx}
            className={`absolute rounded-full ${bubble.size} ${bubble.color} ${bubble.opacity}`}
            initial={{ scale: 0, opacity: 0.15 }}
            animate={{ scale: 1.05, opacity: 1 }}
            transition={{
              delay: bubble.delay,
              type: "spring",
              stiffness: 40,
              duration: 1.4,
            }}
            style={{ filter: "blur(2px)" }}
            // custom positioning handled by class
            {...(bubble.style ? { className: `absolute rounded-full ${bubble.size} ${bubble.color} ${bubble.opacity} ${bubble.style}` } : {})}
          />
        ))}
        {/* Faixa diagonal decorativa */}
        <motion.div
          className="absolute left-0 top-1/2 w-[120vw] h-24 -rotate-12 bg-gradient-to-r from-viva-yellow/70 via-white/30 to-viva-yellow/10 blur-[2px] opacity-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, type: "spring" }}
          aria-hidden
        />
      </div>
      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Texto Hero */}
          <div className="md:w-7/12 lg:w-6/12 text-white text-center md:text-left">
            <motion.h1
              className="text-[2.6rem] leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 animate-fade-in"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              Seu <span className="text-viva-yellow drop-shadow-md">esporte</span>
              <br />
              começa <span className="text-viva-red drop-shadow-md">aqui</span>.
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-100 font-semibold max-w-xl mx-auto md:mx-0 animate-fade-in"
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
            >
              Viva mais energia, saúde e diversão em cada treino. Treine, vença, descubra a sua melhor versão!
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-viva-yellow to-viva-red text-viva-darkBlue font-bold px-9 py-5 rounded-full shadow-xl hover:scale-105 transition-all text-lg border-2 border-white hover:border-viva-red hover:bg-viva-red hover:text-white"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Matricule-se agora
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
          {/* Imagem Hero dinâmica */}
          <motion.div
            className="md:w-5/12 lg:w-6/12 flex justify-center items-center relative"
            variants={imgVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative group">
              <motion.div
                className="absolute -top-6 -left-6 w-36 h-36 bg-gradient-to-br from-viva-red/80 to-viva-yellow/40 rounded-full rotate-6 blur-[2px] z-0 group-hover:scale-110 transition-transform"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 2.7,
                  type: "tween",
                }}
              />
              <div className="overflow-hidden rounded-full shadow-2xl border-8 border-white hover:scale-105 transition-transform bg-white w-72 h-72 md:w-96 md:h-96">
                <motion.img
                  src="/lovable-uploads/69396e5e-96fd-431e-9bb1-29b8a6da9069.png"
                  alt="Praticando esporte"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.06 }}
                  animate={{ scale: [1.06, 1, 1.06] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 3.7,
                    type: "tween",
                  }}
                  draggable={false}
                />
              </div>
              {/* Logo esportivo circulando */}
              <motion.div
                className="absolute -bottom-7 -right-7 w-28 h-28 bg-white rounded-full flex items-center justify-center border-4 border-viva-yellow shadow-lg"
                animate={{ rotate: [0, 25, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 3,
                  type: "tween",
                }}
              >
                <img
                  src="/lovable-uploads/4aad2750-d3a5-4e37-839b-5eef7c466b7c.png"
                  alt="Logo Viva Esportes"
                  className="w-20 h-20 object-contain"
                  draggable={false}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Indicador para rolar para baixo */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white cursor-pointer animate-bounce"
        animate={{ y: [0, 18, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        role="button"
        tabIndex={0}
        aria-label="Role para baixo"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          }
        }}
      >
        <ArrowDown size={36} />
      </motion.div>
    </section>
  );
};

export default Hero;

