
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();
  
  // Configuração do carrossel
  const [emblaRef] = useEmblaCarousel({ loop: true });
  
  // Autoreproducir el carrusel
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const autoplay = () => {
      interval = setInterval(() => {
        if (emblaRef && emblaRef.current) {
          const api = emblaRef.current.emblaApi;
          if (api) api.scrollNext();
        }
      }, 5000);
    };

    autoplay();
    return () => clearInterval(interval);
  }, [emblaRef]);

  // Verificar si el usuario ya está autenticado
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
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Cadastro realizado com sucesso! Verifique seu email.");
      setIsSigningUp(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Carrossel de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container h-full">
            <div className="embla__slide w-full h-full flex-[0_0_100%]">
              <div className="w-full h-full relative">
                <img 
                  src="/public/lovable-uploads/5977c8a7-abd6-44a2-b609-eb4fb3108657.png" 
                  alt="Poker Cards" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </div>
            <div className="embla__slide w-full h-full flex-[0_0_100%]">
              <div className="w-full h-full relative">
                <img 
                  src="/public/lovable-uploads/36882bf8-82e3-4711-b761-c37b11e7fccc.png" 
                  alt="Casino" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </div>
            <div className="embla__slide w-full h-full flex-[0_0_100%]">
              <div className="w-full h-full relative">
                <img 
                  src="/public/lovable-uploads/52e3489b-85b5-4709-9069-a7aa802f7a00.png" 
                  alt="Poker Player" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Formulário de Login */}
      <Card className="w-[350px] z-10 bg-white/90 backdrop-blur-md border-poker-gold">
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
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
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
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
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
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : isSigningUp ? "Cadastrar" : "Entrar"}
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
