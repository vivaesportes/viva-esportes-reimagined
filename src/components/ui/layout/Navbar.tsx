
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth/AuthProvider";
import NavbarLogo from "./NavbarLogo";
import NavbarItems from "./NavbarItems";
import NavbarAuthButton from "./NavbarAuthButton";
import NavbarMobileMenu from "./NavbarMobileMenu";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, profile } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white fixed w-full top-0 left-0 z-50 shadow">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <NavbarLogo />
        
        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu} 
              className="text-viva-darkBlue hover:text-viva-blue p-2 ml-auto"
              aria-label="Toggle menu"
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
              <NavbarAuthButton />
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
