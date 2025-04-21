import { motion } from "framer-motion";
import LocalCard from "./locais/LocalCard";
import LocationsMap from "./locais/LocationsMap";

const Locais = () => {
  const allModalidades = [
    "Futsal",
    "Vôlei",
    "Atletismo",
    "Funcional",
    "Ballet",
    "Jazz",
    "Taekwondo",
    "Muay Thai",
  ];

  const locais = [
    {
      id: 1,
      name: "Colégio Novos Tempos",
      address:
        "Av. Pref. Gil Diniz, 581 - Antigo nº 373 - Centro, Contagem - MG, 32013-650",
      modalidades: allModalidades,
      image: "/lovable-uploads/8f89c5cb-1aed-44a6-a0b1-f898d19e3e51.png",
    },
    {
      id: 2,
      name: "Colégio Novos Tempos - Betim",
      address: "R. Do Acre, 536 - Sra. das Graças, Betim - MG, 32604-640",
      modalidades: ["Ballet", "Futsal", "Vôlei"],
      image: "/lovable-uploads/b50d3221-4c04-4d59-8f15-14faf47fd5d6.png",
    },
  ];

  return (
    <section className="py-20 bg-viva-gray" id="locais">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Onde <span className="text-viva-yellow">Estamos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Confira nossas unidades e escolha a mais próxima de você.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {locais.map((local, index) => (
            <LocalCard key={local.id} local={local} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <LocationsMap />
        </motion.div>
      </div>
    </section>
  );
};

export default Locais;
