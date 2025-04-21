
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth/AuthContext";
import { supabase } from "@/lib/supabase";
import NavbarLogo from "./NavbarLogo";
import NavbarItems from "./NavbarItems";
import NavbarAuthButton from "./NavbarAuthButton";
import NavbarMobileMenu from "./NavbarMobileMenu";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, profile } = useAuth();
  const [checandoAutenticacao, setChecandoAutenticacao] = useState(true);
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    const verificarSessao = async () => {
      try {
        console.log("Navbar - Verificando sessão atual...");
        const { data } = await supabase.auth.getSession();
        console.log("Navbar - Sessão atual:", data.session);
        setChecandoAutenticacao(false);
        
        // Se estamos em produção e não conseguimos carregar a sessão, ainda assim mostramos o botão
        if (window.location.hostname === 'vivaesportes.com.br' && !data.session) {
          console.log("Navbar - Em produção, forçando exibição do botão");
          setForceShow(true);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        setChecandoAutenticacao(false);
        // Em caso de erro, também forçamos a exibição do botão
        setForceShow(true);
      }
    };
    
    verificarSessao();
    
    // Definir um timeout para garantir que o botão seja exibido mesmo em caso de problemas
    const timer = setTimeout(() => {
      if (checandoAutenticacao) {
        console.log("Navbar - Timeout atingido, forçando exibição do botão");
        setChecandoAutenticacao(false);
        setForceShow(true);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Verifica se deve mostrar o botão de login
  const shouldShowAuthButton = !checandoAutenticacao || forceShow;
  console.log("Navbar - Deve mostrar botão:", shouldShowAuthButton);

  return (
    <nav className="bg-white fixed w-full top-0 left-0 z-50 shadow">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <NavbarLogo />
        
        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu} 
              className="text-viva-darkBlue hover:text-viva-blue p-2 ml-auto"
            >
              <Menu size={24} />
            </button>
            
            {isMenuOpen && (
              <NavbarMobileMenu
                isAuthenticated={isAuthenticated}
                profileName={profile?.nome?.split(' ')[0]}
                onClose={closeMenu}
              />
            )}
          </>
        ) : (
          <ul className="flex gap-6 items-center ml-auto">
            <NavbarItems />
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
              {shouldShowAuthButton && (
                <NavbarAuthButton
                  isAuthenticated={isAuthenticated}
                  profileName={profile?.nome?.split(' ')[0]}
                />
              )}
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
