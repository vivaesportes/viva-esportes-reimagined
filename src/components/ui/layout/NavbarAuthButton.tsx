
import { Link } from "react-router-dom";
import { User, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthProvider";

interface NavbarAuthButtonProps {
  onClick?: () => void;
  className?: string;
}

const NavbarAuthButton = ({ 
  onClick,
  className = ""
}: NavbarAuthButtonProps) => {
  const { isAuthenticated, profile } = useAuth();
  const profileName = profile?.nome?.split(' ')[0];
  
  return (
    <Link
      to={isAuthenticated ? "/painel" : "/login"}
      className={`border border-viva-blue text-viva-blue hover:bg-viva-blue hover:text-white font-bold py-2 px-4 rounded-full flex items-center transition-colors ${className}`}
      onClick={onClick}
      data-testid="auth-button"
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
