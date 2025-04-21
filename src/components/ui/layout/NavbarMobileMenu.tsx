
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import NavbarItems from "./NavbarItems";
import NavbarAuthButton from "./NavbarAuthButton";

interface NavbarMobileMenuProps {
  onClose: () => void;
}

const NavbarMobileMenu = ({ onClose }: NavbarMobileMenuProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
    <div 
      className="absolute right-0 top-0 h-screen w-64 bg-white shadow-lg py-4 px-6 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-bold text-viva-darkBlue">Viva Esportes</span>
        </Link>
        <button onClick={onClose} className="text-viva-darkBlue">
          <X size={24} />
        </button>
      </div>
      
      <ul className="flex flex-col gap-4">
        <NavbarItems onClick={onClose} />
        <li className="mt-4">
          <Link
            to="/contato"
            className="block w-full bg-viva-blue hover:bg-viva-darkBlue text-white font-bold py-2 px-4 rounded-full text-center transition-colors"
            onClick={onClose}
          >
            Fale Conosco
          </Link>
        </li>
        <li className="mt-2">
          <NavbarAuthButton
            onClick={onClose}
            className="w-full justify-center"
          />
        </li>
      </ul>
    </div>
  </div>
);

export default NavbarMobileMenu;
