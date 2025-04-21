
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import { UserCircle, Users, BookOpen, Home, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface PainelLayoutProps {
  children: React.ReactNode;
}

const PainelLayout: React.FC<PainelLayoutProps> = ({ children }) => {
  const { profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-viva-darkBlue">Viva Esportes</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="font-semibold">{profile?.nome}</p>
              <p className="text-sm text-gray-500">
                {profile?.role === 'admin' ? 'Administrador' : 'Professor'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-20 md:w-64 bg-white border-r hidden sm:block"
        >
          <nav className="p-4 flex flex-col h-full">
            <div className="space-y-2">
              <Link 
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <Home className="h-5 w-5" />
                <span className="hidden md:inline">Página Inicial</span>
              </Link>
              
              <Link 
                to="/painel"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <UserCircle className="h-5 w-5" />
                <span className="hidden md:inline">Meu Perfil</span>
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <Users className="h-5 w-5" />
                  <span className="hidden md:inline">Administração</span>
                </Link>
              )}
              
              <Link 
                to="/painel?tab=turmas"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <BookOpen className="h-5 w-5" />
                <span className="hidden md:inline">Minhas Turmas</span>
              </Link>
            </div>

            <div className="mt-auto pt-4 border-t">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          </nav>
        </motion.aside>

        {/* Main content */}
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 overflow-auto p-4 md:p-8"
        >
          <div className="container mx-auto max-w-5xl">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default PainelLayout;
