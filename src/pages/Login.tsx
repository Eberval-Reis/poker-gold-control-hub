import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/autoplay-carousel";

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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background carousel */}
      <div className="absolute inset-0 overflow-hidden">
        <Carousel autoplay={true} interval={5000} loop={true} className="h-full">
          <CarouselContent className="h-full">
            <CarouselItem className="h-full">
              <div className="w-full h-full relative">
                <img 
                  src="/lovable-uploads/5977c8a7-abd6-44a2-b609-eb4fb3108657.png" 
                  alt="Poker background 1" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="w-full h-full relative">
                <img 
                  src="/lovable-uploads/36882bf8-82e3-4711-b761-c37b11e7fccc.png" 
                  alt="Poker background 2" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="w-full h-full relative">
                <img 
                  src="/lovable-uploads/52e3489b-85b5-4709-9069-a7aa802f7a00.png" 
                  alt="Poker background 3" 
                  className="w-full h-full object-cover object-center max-h-screen"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      
      {/* Login Form */}
      <Card className="w-[350px] z-10 bg-white/95 shadow-xl">
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
              <Label htmlFor="email" className="text-sm font-medium">
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
              <Label htmlFor="password" className="text-sm font-medium">
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
