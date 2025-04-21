
import { Link } from "react-router-dom";
import { User, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthProvider";
import { Button } from "@/components/ui/button";

interface NavbarAuthButtonProps {
  onClick?: () => void;
  className?: string;
}

const NavbarAuthButton = ({ 
  onClick,
  className = ""
}: NavbarAuthButtonProps) => {
  const { isAuthenticated, profile, signOut } = useAuth();
  const profileName = profile?.nome?.split(' ')[0];
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    
    // Force a page reload to clear any remaining state
    window.location.href = '/login';
  };
  
  return (
    <>
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <Link
            to="/painel"
            className={`border border-viva-blue text-viva-blue hover:bg-viva-blue hover:text-white font-bold py-2 px-4 rounded-full flex items-center transition-colors ${className}`}
            onClick={onClick}
            data-testid="auth-button"
          >
            <User className="mr-2 h-4 w-4" />
            {profileName || "Área do Professor"}
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Sair</span>
          </Button>
        </div>
      ) : (
        <Link
          to="/login"
          className={`border border-viva-blue text-viva-blue hover:bg-viva-blue hover:text-white font-bold py-2 px-4 rounded-full flex items-center transition-colors ${className}`}
          onClick={onClick}
          data-testid="auth-button"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Link>
      )}
    </>
  );
};

export default NavbarAuthButton;
