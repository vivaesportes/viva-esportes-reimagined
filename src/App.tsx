
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GaleriaBalletPascoa from "./pages/GaleriaBalletPascoa";
import { useEffect } from "react";
import Login from "./pages/auth/Login";
import PainelProfessor from "./pages/auth/PainelProfessor";
import PainelAdmin from "./pages/auth/PainelAdmin";
import RotaProtegida from "./components/auth/RotaProtegida";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(`Route changed to: ${pathname}`);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/modalidades" element={<Index />} />
            <Route path="/locais" element={<Index />} />
            <Route path="/galeria" element={<Index />} />
            
            {/* Template route for all gallery detail pages */}
            <Route path="/galeria/ballet-pascoa" element={<GaleriaBalletPascoa />} />
            {/* Additional gallery detail pages will follow the same pattern:
                <Route path="/galeria/nome-da-galeria" element={<GaleriaNomeDaGaleria />} /> 
            */}
            
            <Route path="/eventos" element={<Index />} />
            <Route path="/contato" element={<Index />} />
            
            {/* Rotas de autenticação */}
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
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
