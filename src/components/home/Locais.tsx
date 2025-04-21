
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const Locais = () => {
  const locais = [
    {
      id: 1,
      name: "Colégio Novos Tempos",
      address: "Av. Principal, 123 - Centro",
      modalidades: ["Futsal", "Vôlei", "Funcional"],
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Colégio Novos Tempos - Betim",
      address: "R. Do Acre, 536 - Sra. das Graças, Betim - MG, 32604-640",
      modalidades: ["Futsal", "Vôlei", "Atletismo", "Funcional"],
      image: "/placeholder.svg"
    }
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
            Aulas em diversos locais da cidade para facilitar o acesso de todas as crianças e adolescentes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locais.map((local, index) => (
            <motion.div 
              key={local.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover-scale"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={local.image} 
                  alt={local.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{local.name}</h3>
                <div className="flex items-start mb-4">
                  <MapPin size={18} className="text-viva-red mt-1 mr-2" />
                  <p className="text-gray-600">{local.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Modalidades:</h4>
                  <div className="flex flex-wrap gap-2">
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
