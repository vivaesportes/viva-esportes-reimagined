import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/ui/layout/Layout";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-[120px] md:text-[200px] font-bold text-viva-blue opacity-20 leading-none">
              404
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-viva-blue -mt-16 md:-mt-24">
              Página não encontrada
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Ops! A página que você está procurando não existe ou foi movida.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-viva-red hover:bg-viva-darkRed text-white font-bold rounded-full transition-colors"
            >
              <Home className="mr-2" size={20} /> Voltar para o início
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
