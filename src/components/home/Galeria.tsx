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
      galeriaPascoa: [
        { image: "/lovable-uploads/50ad7bf0-c84e-444a-8a4d-efcb64bf66d6.png", title: "Ballet - Páscoa 1" },
        { image: "/lovable-uploads/b7132928-b31e-4446-8d23-385531a9b33c.png", title: "Ballet - Páscoa 2" },
        { image: "/lovable-uploads/87cdf775-5343-457d-b3e6-a8cd95a42e55.png", title: "Ballet - Páscoa 3" },
        { image: "/lovable-uploads/87cdf775-5343-457d-b3e6-a8cd95a42e55.png", title: "Ballet - Páscoa 3 (Duplicada)" },
        { image: "/lovable-uploads/818070da-6f25-4f03-b519-0ff410320bd4.png", title: "Ballet - Páscoa 4" },
        { image: "/lovable-uploads/fed7f2f1-63af-42e8-8976-5b1bcd806145.png", title: "Ballet - Páscoa 5" },
        { image: "/lovable-uploads/0b26c003-9201-4df3-b528-59f65f7d7fae.png", title: "Ballet - Páscoa 6" },
        { image: "/lovable-uploads/ffb3742a-fc34-45d9-acf0-118f5b5978ae.png", title: "Ballet - Páscoa 7" },
        { image: "/lovable-uploads/1c5d584f-e0c3-4ae4-bc82-bbe05df90267.png", title: "Ballet - Páscoa 8" },
        { image: "/lovable-uploads/9fbda02a-0a4a-46f9-9026-9ba7d96a8fbe.png", title: "Ballet - Páscoa 9" },
      ],
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
          {galeria.map((item, index) => {
            if (item.id === 2 && item.galeriaPascoa) {
              return (
                <div key={item.id} className="flex flex-col gap-4">
                  <GalleryItem item={item} index={index} />
                  <div className="grid grid-cols-2 gap-2">
                    {item.galeriaPascoa.map((sub, i) => (
                      <div key={i} className="rounded overflow-hidden shadow">
                        <img src={sub.image} alt={sub.title} className="w-full h-32 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return <GalleryItem key={item.id} item={item} index={index} />;
          })}
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
