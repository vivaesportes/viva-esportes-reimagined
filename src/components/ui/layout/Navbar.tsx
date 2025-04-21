
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { Menu, X, LogIn, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth/AuthContext";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, profile } = useAuth();
  const [checandoAutenticacao, setChecandoAutenticacao] = useState(true);

  useEffect(() => {
    // Verifica a sessão ao carregar a página
    const verificarSessao = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Navbar - Sessão atual:", data.session);
        setChecandoAutenticacao(false);
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        setChecandoAutenticacao(false);
      }
    };
    
    verificarSessao();
  }, []);

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
        {/* Ensure logo is ALWAYS visible */}
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 min-w-[32px]" />
          <span className="font-bold text-viva-darkBlue hidden sm:inline">Viva Esportes</span>
        </Link>
        
        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu} 
              className="text-viva-darkBlue hover:text-viva-blue p-2 ml-auto"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {isMenuOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu}>
                <div 
                  className="absolute right-0 top-0 h-screen w-64 bg-white shadow-lg py-4 px-6 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <Link to="/" className="flex items-center gap-2">
                      <Logo className="h-8 w-8" />
                      <span className="font-bold text-viva-darkBlue">Viva Esportes</span>
                    </Link>
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
                    <li className="mt-2">
                      {!checandoAutenticacao && (
                        <Link
                          to={isAuthenticated ? "/painel" : "/login"}
                          className="flex items-center justify-center w-full border border-viva-blue text-viva-blue hover:bg-viva-blue hover:text-white font-bold py-2 px-4 rounded-full text-center transition-colors"
                          onClick={closeMenu}
                        >
                          {isAuthenticated ? (
                            <>
                              <User className="mr-2 h-4 w-4" />
                              {profile?.nome ? `Olá, ${profile.nome.split(' ')[0]}` : "Área do Professor"}
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-4 w-4" />
                              Login
                            </>
                          )}
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <ul className="flex gap-6 items-center ml-auto">
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
            <li>
              {!checandoAutenticacao && (
                <Link
                  to={isAuthenticated ? "/painel" : "/login"}
                  className={`border border-viva-blue text-viva-blue hover:bg-viva-blue hover:text-white font-bold py-2 px-4 rounded-full flex items-center transition-colors ${
                    location.pathname === "/login" || location.pathname === "/painel" ? "ring-2 ring-viva-red" : ""
                  }`}
                >
                  {isAuthenticated ? (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      {profile?.nome ? `Olá, ${profile.nome.split(' ')[0]}` : "Área do Professor"}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </>
                  )}
                </Link>
              )}
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
