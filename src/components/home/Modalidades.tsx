
import { motion } from "framer-motion";
import { FaVolleyballBall } from "react-icons/fa";
import { IoMdFitness } from "react-icons/io";
import { PiSoccerBallFill } from "react-icons/pi";
import { IoMusicalNotes } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Ball, Sword, Medal } from "lucide-react";

const Modalidades = () => {
  const modalidades = [
    {
      id: 1,
      name: "Futsal",
      description: "Desenvolva habilidades técnicas, táticas e trabalho em equipe",
      icon: PiSoccerBallFill,
      color: "bg-viva-blue",
    },
    {
      id: 2,
      name: "Vôlei",
      description: "Aprimore coordenação motora, reflexos e espírito competitivo",
      icon: FaVolleyballBall,
      color: "bg-viva-red",
    },
    {
      id: 3,
      name: "Ballet",
      description: "Trabalhe postura, flexibilidade e expressão artística",
      icon: IoMusicalNotes,
      color: "bg-pink-500",
    },
    {
      id: 4,
      name: "Jazz",
      description: "Desenvolva ritmo, coordenação e criatividade musical",
      icon: IoMusicalNotes,
      color: "bg-purple-500",
    },
    {
      id: 5,
      name: "Funcional",
      description: "Treinamento completo para resistência e condicionamento físico",
      icon: IoMdFitness,
      color: "bg-viva-yellow",
    },
    {
      id: 6,
      name: "Basquete",
      description: "Trabalhe agilidade, coordenação motora e espírito de equipe",
      icon: Ball,
      color: "bg-yellow-500",
    },
    {
      id: 7,
      name: "Futebol Society",
      description: "Pratique futebol em campo reduzido e desenvolva estratégias rápidas",
      icon: Ball,
      color: "bg-green-600",
    },
    {
      id: 8,
      name: "Taekwondo",
      description: "Disciplina, foco e autodefesa por meio das artes marciais",
      icon: Sword,
      color: "bg-blue-800",
    },
    {
      id: 9,
      name: "Muay-thai",
      description: "Trabalhe condicionamento físico e autoconfiança com o boxe tailandês",
      icon: Dumbbell,
      color: "bg-red-600",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Nossas <span className="text-viva-red">Modalidades</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Oferecemos diversas atividades esportivas para crianças e adolescentes, desenvolvendo habilidades físicas, sociais e emocionais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modalidades.map((modalidade, index) => (
            <motion.div 
              key={modalidade.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-scale overflow-hidden border-none shadow-lg">
                <CardContent className="p-0">
                  <div className={`${modalidade.color} text-white p-6 flex justify-center items-center`}>
                    <modalidade.icon size={48} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{modalidade.name}</h3>
                    <p className="text-gray-600">{modalidade.description}</p>
                  </div>
                </CardContent>
              </Card>
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
            Todas as modalidades são adaptadas para diferentes faixas etárias e níveis de habilidade
          </p>
          <a 
            href="/modalidades" 
            className="inline-block bg-viva-blue hover:bg-viva-darkBlue text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Ver todas as modalidades
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Modalidades;
