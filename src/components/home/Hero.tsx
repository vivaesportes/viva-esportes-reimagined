
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-viva-blue to-viva-darkBlue">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-viva-red opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-viva-yellow opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-white opacity-10 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 text-white text-center md:text-left mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              <span className="block">Movimento,</span>
              <span className="block">Saúde e</span>
              <span className="text-viva-yellow">Diversão!</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Formando atletas e cidadãos através da prática esportiva
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Button className="bg-viva-red hover:bg-viva-darkRed text-white text-lg px-8 py-6 rounded-full">
                Matricule-se
              </Button>
              <Button variant="outline" className="border-white text-red hover:bg-white/10 text-lg px-8 py-6 rounded-full">
                Conheça as Modalidades
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-viva-yellow rounded-full mx-auto overflow-hidden border-4 border-white">
                <img 
                  src="/placeholder.svg" 
                  alt="Crianças praticando esporte" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-viva-red rounded-full overflow-hidden border-4 border-white">
                <img 
                  src="/placeholder.svg" 
                  alt="Jovem atleta" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={scrollToNextSection}
      >
        <ArrowDown size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
