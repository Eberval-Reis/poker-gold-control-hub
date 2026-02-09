import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { loginWithGoogle } from "@/services/auth.service";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data
      } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      toast({
        title: "Login realizado com sucesso!",
        variant: "default"
      });
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro ao fazer login",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email.",
        variant: "default"
      });
      setIsSigningUp(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro ao criar conta",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.error) {
        toast({
          title: "Erro ao fazer login com Google",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro ao fazer login com Google",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden">
    {/* Background image */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="w-full h-full relative">
        <img src="/lovable-uploads/poker-background-main.jpg" alt="Poker background" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>

    {/* Login Form */}
    <Card className="w-[350px] z-10 bg-white/20 backdrop-blur-sm shadow-xl border-white/30">
      <CardContent className="pt-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-poker-gold mb-2">
            {isSigningUp ? "Criar Conta" : "Login"}
          </h1>
          <p className="text-sm text-green-500">
            {isSigningUp ? "Cadastre-se para acessar o sistema" : "Acesse o sistema de gestão de poker"}
          </p>
        </div>

        <form onSubmit={isSigningUp ? handleSignUp : handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-poker-gold">
              Email
            </Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-poker-gold">
              Senha
            </Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" required />
          </div>

          <Button type="submit" className="w-full bg-poker-gold hover:bg-poker-gold/80 text-white" disabled={loading}>
            {loading ? "Processando..." : isSigningUp ? "Cadastrar" : "Entrar"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/20 px-2 text-poker-gold">Ou</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar com Google
        </Button>

        <div className="mt-4 text-center">
          <button type="button" className="text-sm text-poker-gold hover:underline" onClick={() => setIsSigningUp(!isSigningUp)}>
            {isSigningUp ? "Já tem uma conta? Faça login" : "Não tem uma conta? Cadastre-se"}
          </button>
        </div>
      </CardContent>
    </Card>
  </div>;
};
export default Login;