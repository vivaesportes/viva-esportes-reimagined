
import { motion } from "framer-motion";
import { Award, Heart, Shield, Users } from "lucide-react";

const Sobre = () => {
  const valores = [
    {
      id: 1,
      icon: Users,
      title: "Inclusão",
      description: "Acreditamos que o esporte deve ser acessível a todas as crianças, independentemente de suas habilidades ou origens.",
    },
    {
      id: 2,
      icon: Heart,
      title: "Desenvolvimento",
      description: "Focamos no desenvolvimento integral dos alunos, combinando habilidades físicas, cognitivas e socioemocionais.",
    },
    {
      id: 3,
      icon: Award,
      title: "Excelência",
      description: "Buscamos a excelência em nossas aulas, com metodologias atualizadas e profissionais qualificados.",
    },
    {
      id: 4,
      icon: Shield,
      title: "Espírito de Equipe",
      description: "Promovemos o trabalho em equipe, o respeito mútuo e a colaboração em todas as atividades.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Sobre a <span className="text-viva-blue">Viva</span>
              <span className="text-viva-red">Esportes</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Desde 2011, a Viva Esportes tem se dedicado a oferecer atividades esportivas e artísticas de qualidade para crianças e adolescentes.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Nossa missão é contribuir para o desenvolvimento integral dos alunos, promovendo saúde, bem-estar, socialização e valores como respeito, disciplina e trabalho em equipe.
            </p>
            <div className="bg-viva-gray p-6 rounded-lg border-l-4 border-viva-blue">
              <p className="italic text-gray-700">
                "Acreditamos no poder transformador do esporte na vida das crianças e adolescentes, formando não apenas atletas, mas cidadãos preparados para os desafios da vida."
              </p>
              <p className="font-bold mt-2">Carlos Diniz, Fundador</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {valores.map((valor, index) => (
                <motion.div
                  key={valor.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover-scale"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    index % 2 === 0 ? "bg-viva-blue" : "bg-viva-red"
                  } text-white`}>
                    <valor.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{valor.title}</h3>
                  <p className="text-gray-600">{valor.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
