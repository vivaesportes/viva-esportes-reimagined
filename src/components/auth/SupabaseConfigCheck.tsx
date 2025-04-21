
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SupabaseConfigCheck = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-xl w-full">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-red-700 mb-2 text-center">
          Erro de Configuração do Supabase
        </h2>
        <div className="space-y-4">
          <p className="text-red-600">
            As variáveis de ambiente do Supabase não estão configuradas. Para o sistema de login funcionar, você precisa configurar:
          </p>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm">
            <div className="mb-1">VITE_SUPABASE_URL</div>
            <div>VITE_SUPABASE_ANON_KEY</div>
          </div>
          <p className="text-gray-700">
            Para obter essas informações:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Acesse seu projeto no <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase</a></li>
            <li>Vá para <strong>Settings {'>'} API</strong></li>
            <li>Copie a <strong>Project URL</strong> (para VITE_SUPABASE_URL)</li>
            <li>Copie a <strong>anon public</strong> key (para VITE_SUPABASE_ANON_KEY)</li>
            <li>Configure essas variáveis no seu projeto Lovable</li>
          </ol>
          <div className="flex justify-center pt-2">
            <Button 
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700"
            >
              Voltar para a Página Inicial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
