
import { motion } from "framer-motion";

const Parceiros = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Nossos <span className="text-viva-blue">Parceiros</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Organizações que acreditam no poder do esporte para transformar vidas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3">
                <a href="https://www.ient.com.br" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/lovable-uploads/0825c09f-a0cf-48e1-aa35-5dd9639341cd.png"
                    alt="Colégio Novos Tempos"
                    className="w-full h-auto hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold text-viva-blue mb-4">
                  Instituto Educacional Novos Tempos
                </h3>
                <p className="text-gray-600 mb-4">
                  O Instituto Educacional Novos Tempos é nosso parceiro na missão de formar não apenas atletas, mas cidadãos completos. Com uma tradição de excelência em educação, o colégio compartilha nossa visão de que esporte e educação andam juntos no desenvolvimento integral de crianças e jovens.
                </p>
                <a 
                  href="https://www.ient.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-viva-blue hover:text-viva-darkBlue font-semibold inline-flex items-center gap-2"
                >
                  Visite o site
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Parceiros;
