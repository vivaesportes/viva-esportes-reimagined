
import { Link, useLocation } from "react-router-dom";

export const menuItems = [
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

interface NavbarItemsProps {
  onClick?: () => void;
}

const NavbarItems = ({ onClick }: NavbarItemsProps) => {
  const location = useLocation();

  return (
    <>
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
            onClick={onClick}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </>
  );
};

export default NavbarItems;
