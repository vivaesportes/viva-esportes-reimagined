
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-viva-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Viva Esportes</h3>
            <p className="text-gray-200">
              Formando atletas e cidadãos desde 2010. Acreditamos no poder do esporte para
              transformar vidas e construir um futuro melhor para nossas crianças e adolescentes.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-viva-yellow transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="hover:text-viva-yellow transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-viva-yellow transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-200 hover:text-viva-yellow transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/modalidades" className="text-gray-200 hover:text-viva-yellow transition-colors">
                  Modalidades
                </Link>
              </li>
              <li>
                <Link to="/locais" className="text-gray-200 hover:text-viva-yellow transition-colors">
                  Locais
                </Link>
              </li>
              <li>
                <Link to="/galeria" className="text-gray-200 hover:text-viva-yellow transition-colors">
                  Galeria
                </Link>
              </li>
              <li>
                <Link to="/eventos" className="text-gray-200 hover:text-viva-yellow transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-200 hover:text-viva-yellow transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin size={20} className="text-viva-yellow" />
                <span className="text-gray-200">Av. Principal, 123 - Centro</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={20} className="text-viva-yellow" />
                <span className="text-gray-200">(31) 99290-1175</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={20} className="text-viva-yellow" />
                <span className="text-gray-200">contato@vivaesportes.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-viva-darkBlue mt-12 pt-8 text-center">
          <p className="text-gray-300">
            &copy; {currentYear} Viva Esportes. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
