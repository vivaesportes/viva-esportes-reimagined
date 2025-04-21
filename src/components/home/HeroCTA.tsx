
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroCTAProps {
  whatsappUrl: string;
  fadeUpVariants: any;
}

const HeroCTA = ({ whatsappUrl, fadeUpVariants }: HeroCTAProps) => {
  return (
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
  );
};

export default HeroCTA;
