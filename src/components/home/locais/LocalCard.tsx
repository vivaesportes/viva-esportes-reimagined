
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface LocalCardProps {
  local: {
    id: number;
    name: string;
    address: string;
    modalidades: string[];
    image: string;
  };
  index: number;
}

const LocalCard = ({ local, index }: LocalCardProps) => {
  return (
    <motion.div
      key={local.id}
      className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col hover-scale"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="h-52 w-full overflow-hidden flex items-center justify-center bg-viva-blue/5">
        <img
          src={local.image}
          alt={local.name}
          className="object-cover w-full h-full transition-transform duration-500"
          style={{ maxHeight: "208px" }}
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2 text-center">{local.name}</h3>
        <div className="flex items-start mb-4 justify-center">
          <MapPin size={18} className="text-viva-red mt-1 mr-2" />
          <p className="text-gray-600 text-center">{local.address}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-center">Modalidades:</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {local.modalidades.map((modalidade) => (
              <span
                key={modalidade}
                className="bg-viva-blue/10 text-viva-blue px-3 py-1 rounded-full text-sm"
              >
                {modalidade}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocalCard;
