
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo";

// Ajuste para obter a rota atual e destacar itens do menu conforme necessário
const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white fixed w-full top-0 left-0 z-50 shadow">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-bold text-viva-darkBlue">Viva Esportes</span>
        </Link>
        <ul className="flex gap-6 items-center">
          <li>
            <Link
              to="/modalidades"
              className={`hover:text-viva-blue transition-colors ${
                location.pathname === "/modalidades" ? "text-viva-blue font-bold" : ""
              }`}
            >
              Nossas Modalidades
            </Link>
          </li>
          <li>
            <Link
              to="/locais"
              className={`hover:text-viva-blue transition-colors ${
                location.pathname === "/locais" ? "text-viva-blue font-bold" : ""
              }`}
            >
              Nossos Locais
            </Link>
          </li>
          <li>
            <Link
              to="/galeria"
              className={`hover:text-viva-blue transition-colors ${
                location.pathname === "/galeria" ? "text-viva-blue font-bold" : ""
              }`}
            >
              Nossa Galeria
            </Link>
          </li>
          <li>
            <Link
              to="/eventos"
              className={`hover:text-viva-blue transition-colors ${
                location.pathname === "/eventos" ? "text-viva-blue font-bold" : ""
              }`}
            >
              Eventos
            </Link>
          </li>
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
      </div>
    </nav>
  );
};

export default Navbar;
