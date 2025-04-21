
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "../WhatsAppButton";
import Logo from "@/components/ui/Logo"; // Import the Logo component

const Layout = ({ children }: LayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading to show animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            <div className="text-center">
              <Logo 
                size={128} 
                className="mx-auto mb-4 animate-bounce" 
              />
              <h1 className="text-3xl font-bold text-viva-blue">
                Viva<span className="text-viva-red">Esportes</span>
              </h1>
              <p className="text-gray-500 mt-2">Carregando...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <WhatsAppButton phoneNumber="5511987654321" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
