
import { Link } from "react-router-dom";
import { User, LogIn } from "lucide-react";

interface NavbarAuthButtonProps {
  isAuthenticated: boolean;
  profileName?: string;
  onClick?: () => void;
  className?: string;
}

const NavbarAuthButton = ({ 
  isAuthenticated, 
  profileName, 
  onClick,
  className = ""
}: NavbarAuthButtonProps) => {
  console.log("NavbarAuthButton - isAuthenticated:", isAuthenticated, "profileName:", profileName);
  
  return (
    <Link
      to={isAuthenticated ? "/painel" : "/login"}
      className={`border border-viva-blue text-viva-blue hover:bg-viva-blue hover:text-white font-bold py-2 px-4 rounded-full flex items-center transition-colors ${className}`}
      onClick={onClick}
    >
      {isAuthenticated ? (
        <>
          <User className="mr-2 h-4 w-4" />
          {profileName || "Área do Professor"}
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </>
      )}
    </Link>
  );
};

export default NavbarAuthButton;
