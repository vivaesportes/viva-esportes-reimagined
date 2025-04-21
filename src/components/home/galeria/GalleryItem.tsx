
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface GalleryItemProps {
  item: {
    id: number;
    title: string;
    description: string;
    image: string;
    link?: string; // Optional link to a dedicated gallery page
  };
  index: number;
}

const GalleryItem = ({ item, index }: GalleryItemProps) => {
  const Content = () => (
    <>
      <img 
        src={item.image} 
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-xl font-bold text-white">{item.title}</h3>
        <p className="text-white/80">{item.description}</p>
        {item.link && (
          <p className="text-viva-yellow mt-2 text-sm">Clique para ver mais fotos</p>
        )}
      </div>
    </>
  );

  return (
    <motion.div 
      key={item.id}
      className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer aspect-square"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
    >
      {item.link ? (
        <Link to={item.link} className="block w-full h-full">
          <Content />
        </Link>
      ) : (
        <Content />
      )}
    </motion.div>
  );
};

export default GalleryItem;
