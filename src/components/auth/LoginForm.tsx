
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Eye, EyeOff, Lock } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useLoginForm } from "@/hooks/useLoginForm";

const LoginForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    showPassword,
    setShowPassword,
    errorMessage,
    handleSubmit
  } = useLoginForm();

  return (
    <Card className="border-2 border-viva-blue/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Logo size={80} />
        </div>
        <CardTitle className="text-2xl font-bold">
          Portal do Professor
        </CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar o painel
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-viva-blue hover:bg-viva-darkBlue"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">
          Esqueceu sua senha? Entre em contato com o administrador.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
