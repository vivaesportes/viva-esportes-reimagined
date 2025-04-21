
import { motion } from "framer-motion";
import EventoCard from "./eventos/EventoCard";

const Eventos = () => {
  const eventos = [
    {
      id: 1,
      title: "Festival de Dança",
      date: "22/05/2025",
      time: "19:00",
      location: "Teatro Municipal",
      description: "Apresentação de todas as turmas de ballet e jazz",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Campeonato de Futsal",
      date: "10/06/2025",
      time: "09:00",
      location: "Centro Esportivo",
      description: "Competição entre as turmas de diferentes categorias",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Torneio de Vôlei",
      date: "15/07/2025",
      time: "14:00",
      location: "Ginásio Municipal",
      description: "Participação das equipes juvenis no torneio regional",
      image: "/placeholder.svg",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Próximos <span className="text-viva-yellow">Eventos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Confira nossa agenda de atividades, festivais e competições.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventos.map((evento, index) => (
            <EventoCard key={evento.id} evento={evento} index={index} />
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a 
            href="/eventos" 
            className="inline-block bg-viva-blue hover:bg-viva-darkBlue text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Ver calendário completo
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Eventos;
