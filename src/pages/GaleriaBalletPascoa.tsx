
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fotosBalletPascoa = [
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
];

const GaleriaBalletPascoa = () => {
  return (
    <section className="pt-32 pb-20 bg-viva-gray min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-viva-darkBlue mb-2">Galeria Ballet - Páscoa</h1>
          <p className="text-gray-600 text-lg">Veja todos os registros fotográficos dessa apresentação especial de Páscoa.</p>
          <Link to="/galeria" className="inline-block mt-6 bg-viva-blue hover:bg-viva-darkBlue text-white px-6 py-2 rounded-full font-semibold transition-colors">Voltar para Galeria</Link>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {fotosBalletPascoa.map((foto, idx) => (
            <motion.div
              key={foto.image + idx}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05 * idx }}
              className="rounded-xl overflow-hidden shadow-lg bg-white hover-scale"
            >
              <img src={foto.image} alt={foto.title} className="w-full h-72 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-center text-gray-900">{foto.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GaleriaBalletPascoa;
