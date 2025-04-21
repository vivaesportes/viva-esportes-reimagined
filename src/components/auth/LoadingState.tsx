
import { Loader2, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface LoadingStateProps {
  loadingTimeout: boolean;
  longLoadingTimeout: boolean;
  retrying: boolean;
  resetAttempted: boolean;
  onRetry: () => void;
  onReset: () => void;
  onForceLogout: () => void;
  authError: string | null;
  databaseCheck: string | null;
  checkingDatabase: boolean;
}

export const LoadingState = ({
  loadingTimeout,
  longLoadingTimeout,
  retrying,
  resetAttempted,
  onRetry,
  onReset,
  onForceLogout,
  authError,
  databaseCheck,
  checkingDatabase
}: LoadingStateProps) => {
  if (!loadingTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-viva-blue" />
        <span className="text-xl font-medium ml-4">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-viva-blue mb-6" />
      <span className="text-xl font-medium mb-4">Carregando...</span>
      
      <div className="mt-6 max-w-md text-center p-6 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-4" />
        <p className="text-amber-700 text-lg font-medium mb-3">Está demorando mais do que o esperado</p>
        <p className="text-gray-600 mb-6">
          Isso pode acontecer se você está fazendo login pela primeira vez ou se houver problemas com a conexão.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button 
            variant="outline" 
            size="lg"
            className="gap-2 items-center inline-flex"
            onClick={onRetry}
            disabled={retrying}
          >
            <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
            {retrying ? 'Tentando...' : 'Tentar novamente'}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="gap-2 items-center inline-flex"
            onClick={onReset}
            disabled={resetAttempted}
          >
            <RefreshCw className="h-4 w-4" />
            Resetar estado
          </Button>
          <Button 
            variant="destructive" 
            size="lg"
            onClick={onForceLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Voltar para o login
          </Button>
        </div>
        
        {longLoadingTimeout && (
          <div className="mt-8 border-t border-amber-200 pt-6">
            <h3 className="font-medium text-amber-800 mb-4">Diagnóstico Avançado</h3>
            
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro ao carregar perfil</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 pt-2 border-t border-red-200">
                    <code className="text-xs opacity-70">{authError}</code>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {databaseCheck && (
              <div className="bg-white p-3 rounded border border-amber-200 text-sm font-mono text-amber-800 max-h-32 overflow-y-auto">
                {databaseCheck}
              </div>
            )}
            
            {checkingDatabase && (
              <div className="flex items-center justify-center mt-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-amber-700">Verificando banco de dados...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
