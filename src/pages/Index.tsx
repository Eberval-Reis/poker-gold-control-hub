
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleDollarSign, Diamond, Key, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/autoplay-carousel';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login with:', email, password);
    navigate('/register-club');
  };

  const handleRegister = () => {
    navigate('/register-club');
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel autoplay={true} interval={6000} loop={true} className="w-full h-full">
          <CarouselContent className="h-screen">
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                <img 
                  src="/lovable-uploads/bc2d854d-b1fb-4321-ab88-f11760fd0850.png" 
                  alt="Poker table with cards" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                <img 
                  src="/lovable-uploads/77a82eaa-be06-4f0d-b570-77e7d2fee8c6.png" 
                  alt="Poker chips on table" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
              </div>
            </CarouselItem>
            <CarouselItem className="h-full">
              <div className="relative w-full h-full">
                <img 
                  src="/lovable-uploads/abccd166-aa10-4419-be2b-f38e178e2b38.png" 
                  alt="Poker cards close up" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      {/* Poker Theme Elements */}
      <div className="absolute top-8 left-8 z-10">
        <CircleDollarSign size={32} className="text-poker-gold animate-pulse" />
      </div>
      <div className="absolute bottom-8 right-8 z-10">
        <Diamond size={40} className="text-poker-gold animate-pulse" />
      </div>
      
      {/* Login Form */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md bg-black/80 border border-poker-gold/30 backdrop-blur-sm">
          <div className="pt-8 px-6 text-center">
            <h1 className="text-4xl font-bold text-poker-gold mb-2">BEM VINDO</h1>
            <p className="text-gray-300 mb-6">FAÇA LOGIN</p>
          </div>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Seu email"
                    className="bg-black/40 border-gray-700 text-white pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    className="bg-black/40 border-gray-700 text-white pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <LogIn className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-poker-gold hover:bg-poker-gold/90 text-black font-bold transition-all"
              >
                Entrar
              </Button>
              
              <div className="pt-4 text-center">
                <Button
                  variant="link"
                  className="text-poker-gold hover:text-poker-gold/80"
                  onClick={handleRegister}
                >
                  Novo Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
