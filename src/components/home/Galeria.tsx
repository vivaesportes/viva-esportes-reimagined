
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GalleryItem from "./galeria/GalleryItem";

const Galeria = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const galeria = [
    {
      id: 1,
      title: "Turma de Futsal",
      description: "Aula de futsal para crianças de 7 a 10 anos",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Apresentação de Ballet",
      description: "Apresentação de fim de ano da turma de ballet",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Competição de Vôlei",
      description: "Equipe juvenil no campeonato regional",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      title: "Festival de Dança",
      description: "Apresentação de jazz no festival da cidade",
      image: "/placeholder.svg",
    },
    {
      id: 5,
      title: "Treino Funcional",
      description: "Atividades ao ar livre para adolescentes",
      image: "/placeholder.svg",
    },
    {
      id: 6,
      title: "Atletismo",
      description: "Corrida no centro esportivo municipal",
      image: "/placeholder.svg",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === galeria.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? galeria.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="galeria" className="py-20 bg-viva-gray relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Nossa <span className="text-viva-red">Galeria</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Confira alguns momentos especiais das nossas atividades e eventos.
          </p>
        </motion.div>

        {/* Desktop Gallery */}
        <div className="hidden md:grid grid-cols-3 gap-5">
          {galeria.map((item, index) => (
            <GalleryItem key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <div className="relative aspect-video">
              <img 
                src={galeria[currentIndex].image} 
                alt={galeria[currentIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-xl font-bold text-white">{galeria[currentIndex].title}</h3>
                <p className="text-white/80">{galeria[currentIndex].description}</p>
              </div>
            </div>
          </div>
          
          <button 
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md"
            onClick={prevSlide}
          >
            <ChevronLeft className="text-viva-darkBlue" size={20} />
          </button>
          
          <button 
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md"
            onClick={nextSlide}
          >
            <ChevronRight className="text-viva-darkBlue" size={20} />
          </button>
          
          <div className="flex justify-center mt-4 space-x-2">
            {galeria.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-viva-blue" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a 
            href="/galeria" 
            className="inline-block bg-viva-blue hover:bg-viva-darkBlue text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Ver mais fotos
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Galeria;
