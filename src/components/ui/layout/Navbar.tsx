
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Início", path: "/" },
    { title: "Modalidades", path: "/modalidades" },
    { title: "Locais", path: "/locais" },
    { title: "Galeria", path: "/galeria" },
    { title: "Eventos", path: "/eventos" },
    { title: "Contato", path: "/contato" },
  ];

  // WhatsApp link for Matricule-se button
  const whatsappNumber = "31992901175";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Logo size={48} className="min-w-[40px] max-w-[52px] h-auto" />
          <span className="text-2xl font-bold flex items-end gap-1 select-none">
            <span className="text-viva-blue">Viva</span>
            <span className="text-viva-red">Esportes</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="font-medium text-viva-darkGray hover:text-viva-blue transition-colors"
            >
              {link.title}
            </Link>
          ))}
          <Button
            asChild
            className="bg-viva-red hover:bg-viva-darkRed text-white rounded-full"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Matricule-se
            </a>
          </Button>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-viva-darkGray p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white absolute top-full left-0 w-full shadow-md py-4"
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="font-medium text-viva-darkGray hover:text-viva-blue transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            <Button
              asChild
              className="bg-viva-red hover:bg-viva-darkRed text-white rounded-full w-full"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
              >
                Matricule-se
              </a>
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;

