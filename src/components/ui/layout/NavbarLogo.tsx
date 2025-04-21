
import { Link } from "react-router-dom";
import Logo from "../Logo";

const NavbarLogo = () => (
  <Link to="/" className="flex items-center gap-2">
    <Logo className="h-8 w-8 min-w-[32px]" />
    <span className="font-bold text-viva-darkBlue hidden sm:inline">Viva Esportes</span>
  </Link>
);

export default NavbarLogo;
