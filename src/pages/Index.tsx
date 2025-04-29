import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />
      
      <main className="flex flex-col justify-center items-center p-4 gap-8 bg-neutral-800">
        <div className="w-full max-w-md">
          <img alt="Jogador de poker com cartas e fichas" className="w-full h-auto rounded-lg" src="/lovable-uploads/f1a8745e-4a99-4d21-93a8-de99717a9b35.jpg" />
        </div>
        
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-poker-gold/50 to-poker-gold/30 blur-xl animate-pulse"></div>
          
          <Button className="relative px-8 py-6 text-xl font-bold bg-poker-gold hover:bg-poker-gold/90 text-poker-text-light" onClick={() => navigate('/register-club')}>
            Iniciar
          </Button>
        </div>
      </main>
    </div>;
};
export default Index;