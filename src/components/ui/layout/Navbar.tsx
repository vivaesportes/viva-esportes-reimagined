
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    {
      title: "Nossas Modalidades",
      path: "/modalidades",
    },
    {
      title: "Nossos Locais",
      path: "/locais",
    },
    {
      title: "Nossa Galeria",
      path: "/galeria",
    },
    {
      title: "Eventos",
      path: "/eventos",
    }
  ];

  return (
    <nav className="bg-white fixed w-full top-0 left-0 z-50 shadow">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-bold text-viva-darkBlue">Viva Esportes</span>
        </Link>
        
        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu} 
              className="text-viva-darkBlue hover:text-viva-blue p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Mobile menu overlay */}
            {isMenuOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu}>
                <div 
                  className="absolute right-0 top-0 h-screen w-64 bg-white shadow-lg py-4 px-6 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-end mb-6">
                    <button onClick={closeMenu} className="text-viva-darkBlue">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <ul className="flex flex-col gap-4">
                    {menuItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`block py-2 hover:text-viva-blue transition-colors ${
                            location.pathname === item.path || 
                            (item.path === "/galeria" && location.pathname.startsWith("/galeria")) 
                              ? "text-viva-blue font-bold" 
                              : ""
                          }`}
                          onClick={closeMenu}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                    <li className="mt-4">
                      <Link
                        to="/contato"
                        className="block w-full bg-viva-blue hover:bg-viva-darkBlue text-white font-bold py-2 px-4 rounded-full text-center transition-colors"
                        onClick={closeMenu}
                      >
                        Fale Conosco
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <ul className="flex gap-6 items-center">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`hover:text-viva-blue transition-colors ${
                    location.pathname === item.path || 
                    (item.path === "/galeria" && location.pathname.startsWith("/galeria")) 
                      ? "text-viva-blue font-bold" 
                      : ""
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contato"
                className={`bg-viva-blue hover:bg-viva-darkBlue text-white font-bold py-2 px-4 rounded-full transition-colors ${
                  location.pathname === "/contato" ? "ring-2 ring-viva-red" : ""
                }`}
              >
                Fale Conosco
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
