
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

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
      image: "/lovable-uploads/8f89c5cb-1aed-44a6-a0b1-f898d19e3e51.png", // Original image for Colégio Novos Tempos
    },
    {
      id: 2,
      name: "Colégio Novos Tempos - Betim",
      address: "R. Do Acre, 536 - Sra. das Graças, Betim - MG, 32604-640",
      modalidades: ["Ballet", "Futsal", "Vôlei"],
      image: "/lovable-uploads/03e4951d-c5d7-4b38-9f1b-06a3aa3ca031.png", // New user attached image for Betim
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
            Onde <span className="text-viva-blue">Estamos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Aulas em diversos locais da cidade para facilitar o acesso de todas
            as crianças e adolescentes.
          </p>
        </motion.div>

        <div className="flex justify-center">
          {/* Center container containing locais cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl w-full">
            {locais.map((local, index) => (
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
          <p className="text-lg text-gray-600 mb-8">
            Todas as nossas unidades contam com infraestrutura adequada e profissionais qualificados
          </p>
          <a
            href="/locais"
            className="inline-block bg-viva-blue hover:bg-viva-darkBlue text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Ver todos os locais
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Locais;

