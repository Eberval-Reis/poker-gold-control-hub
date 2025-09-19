import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();
  
  // Check if the user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login realizado com sucesso!",
        variant: "default",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email.",
        variant: "default",
      });
      setIsSigningUp(false);
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-full relative">
          <img 
            src="/lovable-uploads/poker-background-main.jpg" 
            alt="Poker background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      </div>
      
      {/* Login Form */}
      <Card className="w-[350px] z-10 bg-white/20 backdrop-blur-sm shadow-xl border-white/30">
        <CardContent className="pt-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-poker-gold mb-2">
              {isSigningUp ? "Criar Conta" : "Login"}
            </h1>
            <p className="text-sm text-gray-600">
              {isSigningUp ? "Cadastre-se para acessar o sistema" : "Acesse o sistema de gestão de poker"}
            </p>
          </div>
          
          <form onSubmit={isSigningUp ? handleSignUp : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-poker-gold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-poker-gold">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-poker-gold hover:bg-poker-gold/80 text-white"
              disabled={loading}
            >
              {loading ? "Processando..." : isSigningUp ? "Cadastrar" : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-poker-gold hover:underline"
              onClick={() => setIsSigningUp(!isSigningUp)}
            >
              {isSigningUp ? "Já tem uma conta? Faça login" : "Não tem uma conta? Cadastre-se"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
