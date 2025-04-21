
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventoCardProps {
  evento: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image: string;
  };
  index: number;
}

const EventoCard = ({ evento, index }: EventoCardProps) => {
  return (
    <motion.div 
      key={evento.id}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover-scale border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={evento.image} 
          alt={evento.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-viva-red text-white px-4 py-2 rounded-full text-sm font-bold">
          Próximo
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3">{evento.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 text-viva-blue" />
            <span>{evento.date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2 text-viva-blue" />
            <span>{evento.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2 text-viva-blue" />
            <span>{evento.location}</span>
          </div>
        </div>
        <p className="text-gray-600">{evento.description}</p>
      </div>
      <div className="px-6 pb-6">
        <button className="w-full bg-viva-blue hover:bg-viva-darkBlue text-white py-2 px-4 rounded-full transition-colors">
          Saiba mais
        </button>
      </div>
    </motion.div>
  );
};

export default EventoCard;
