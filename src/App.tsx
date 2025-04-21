
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { isSupabaseConfigured } from "./lib/supabase";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GaleriaBalletPascoa from "./pages/GaleriaBalletPascoa";
import Login from "./pages/auth/Login";
import PainelProfessor from "./pages/auth/PainelProfessor";
import PainelAdmin from "./pages/auth/PainelAdmin";
import RotaProtegida from "./components/auth/RotaProtegida";
import { AuthProvider } from "./contexts/AuthContext";
import PrimeiroAcesso from "./pages/auth/PrimeiroAcesso";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(`Route changed to: ${pathname}`);
  }, [pathname]);

  return null;
};

const DirectLinkNav = () => {
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-slate-800 text-white p-4 rounded-lg shadow-lg">
      <h3 className="mb-2 font-bold text-center border-b pb-1">Links Rápidos</h3>
      <ul className="space-y-2">
        <li>
          <Link to="/" className="block hover:text-blue-300">Home</Link>
        </li>
        <li>
          <Link to="/login" className="block hover:text-blue-300">Login</Link>
        </li>
        <li>
          <Link to="/primeiro-acesso" className="block hover:text-blue-300 font-bold">
            Primeiro Acesso Admin
          </Link>
        </li>
        <li>
          <Link to="/painel" className="block hover:text-blue-300">Painel Professor</Link>
        </li>
        <li>
          <Link to="/admin" className="block hover:text-blue-300">Painel Admin</Link>
        </li>
      </ul>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ As variáveis de ambiente do Supabase não estão configuradas. Para configurar corretamente acesse:');
      console.warn('1. Projeto do Supabase > Settings > API');
      console.warn('2. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu projeto Lovable');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <DirectLinkNav />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/modalidades" element={<Index />} />
              <Route path="/locais" element={<Index />} />
              <Route path="/galeria" element={<Index />} />
              
              <Route path="/galeria/ballet-pascoa" element={<GaleriaBalletPascoa />} />
              
              <Route path="/eventos" element={<Index />} />
              <Route path="/contato" element={<Index />} />
              
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/painel" 
                element={
                  <RotaProtegida>
                    <PainelProfessor />
                  </RotaProtegida>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <RotaProtegida nivelRequerido="admin">
                    <PainelAdmin />
                  </RotaProtegida>
                } 
              />
              
              <Route path="/primeiro-acesso" element={<PrimeiroAcesso />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
