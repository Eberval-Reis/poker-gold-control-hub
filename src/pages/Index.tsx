
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, Building, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />
      
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-neutral-800 p-6 rounded-lg">
            <div className="w-full max-w-xs">
              <img 
                alt="Jogador de poker com cartas e fichas" 
                className="w-full h-auto rounded-lg" 
                src="/lovable-uploads/bc2d854d-b1fb-4321-ab88-f11760fd0850.png" 
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold text-white">Poker Club Manager</h1>
              <p className="text-gray-300">
                Gerencie clubes, torneios e despesas relacionadas a jogos de poker em um único lugar.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-poker-gold hover:bg-poker-gold/90 text-black font-bold"
                  onClick={() => navigate('/register-club')}
                >
                  Começar
                </Button>
              </div>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="Clubes" 
              description="Cadastre e gerencie clubes de poker" 
              icon={Building}
              onClick={() => navigate('/register-club')} 
            />
            
            <FeatureCard 
              title="Torneios" 
              description="Organize torneios e acompanhe resultados" 
              icon={TrendingUp}
              onClick={() => navigate('/register-tournament')} 
            />
            
            <FeatureCard 
              title="Despesas" 
              description="Registre e controle todas as despesas" 
              icon={Wallet}
              onClick={() => navigate('/register-expense')} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  onClick: () => void;
}) => {
  return (
    <div 
      className="relative overflow-hidden group cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
      onClick={onClick}
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-poker-gold/20 to-poker-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative flex flex-col h-full">
        <div className="rounded-full bg-poker-gold/10 p-3 w-fit mb-4">
          <Icon size={24} className="text-poker-gold" />
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-poker-text-dark">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="mt-auto pt-4">
          <Button 
            variant="ghost" 
            className="w-full text-poker-gold hover:text-poker-gold hover:bg-poker-gold/10"
          >
            Gerenciar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
