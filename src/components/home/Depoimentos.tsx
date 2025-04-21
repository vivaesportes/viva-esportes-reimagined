
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const Depoimentos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const depoimentos = [
    {
      id: 1,
      name: "Ana Silva",
      role: "Mãe do Pedro, 8 anos",
      image: "/placeholder.svg",
      stars: 5,
      text: "Meu filho está na turma de futsal há 1 ano e a evolução dele foi incrível! Além de melhorar nas habilidades esportivas, ele ganhou mais confiança e fez novos amigos. Os professores são muito dedicados e atenciosos.",
    },
    {
      id: 2,
      name: "Carlos Oliveira",
      role: "Pai da Mariana, 10 anos",
      image: "/placeholder.svg",
      stars: 5,
      text: "As aulas de ballet da Viva Esportes são excelentes! Minha filha adora ir às aulas e está aprendendo muito. A metodologia é divertida e ao mesmo tempo profissional. Super recomendo!",
    },
    {
      id: 3,
      name: "Júlia Mendes",
      role: "Aluna de Vôlei, 15 anos",
      image: "/placeholder.svg",
      stars: 5,
      text: "Faço aulas de vôlei há 2 anos e posso dizer que a Viva Esportes tem os melhores professores! O ambiente é muito acolhedor e as aulas são dinâmicas. Evoluí muito desde que comecei.",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === depoimentos.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? depoimentos.length - 1 : prevIndex - 1));
  };

  const renderStars = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, index) => <Star key={index} size={16} className="fill-yellow-400 text-yellow-400" />);
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-viva-blue opacity-5"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-viva-red opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            O que <span className="text-viva-blue">Dizem</span> Sobre Nós
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Confira depoimentos de pais e alunos que fazem parte da nossa comunidade.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex"
            >
              {depoimentos.map((depoimento) => (
                <div
                  key={depoimento.id}
                  className="min-w-full px-4"
                >
                  <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center mb-6">
                      <div className="mb-4 md:mb-0 md:mr-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-viva-blue/20">
                          <img
                            src={depoimento.image}
                            alt={depoimento.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold">{depoimento.name}</h3>
                        <p className="text-gray-600 mb-2">{depoimento.role}</p>
                        <div className="flex justify-center md:justify-start">
                          {renderStars(depoimento.stars)}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-gray-600 italic">
                      "{depoimento.text}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Depoimento anterior"
          >
            <ChevronLeft size={24} className="text-viva-blue" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Próximo depoimento"
          >
            <ChevronRight size={24} className="text-viva-blue" />
          </button>

          <div className="flex justify-center mt-8 space-x-2">
            {depoimentos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-viva-blue w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Depoimentos;
