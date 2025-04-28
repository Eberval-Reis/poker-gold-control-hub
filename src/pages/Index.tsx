
import React, { useState } from 'react';
import Header from '@/components/Header';
import SummaryCard from '@/components/SummaryCard';
import Sidebar from '@/components/Sidebar';
import { Chip, Cards, Trophy, Calendar, FileMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />
      
      <main className="p-4 max-w-md mx-auto">
        <section className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold mb-2">Resumo</h2>
          
          <SummaryCard 
            title="Bankroll"
            value="R$ 2.500,00"
            icon={Chip}
          />
          
          <SummaryCard 
            title="Próximo Torneio"
            value="Texas Hold'em - R$ 500"
            subtitle="23/04 - 19:00 - Clube do Poker"
            icon={Calendar}
          />
          
          <SummaryCard 
            title="Último Jogo"
            value="+R$ 350,00"
            subtitle="20/04 - Cash Game"
            icon={Cards}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold mb-2">Ações Rápidas</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Button className="gold-button flex items-center gap-2 h-auto py-3">
              <Calendar size={18} />
              Novo Torneio
            </Button>
            
            <Button className="gold-button flex items-center gap-2 h-auto py-3">
              <Cards size={18} />
              Registrar Jogo
            </Button>
            
            <Button className="gold-button flex items-center gap-2 h-auto py-3">
              <Trophy size={18} />
              Ver Rankings
            </Button>
            
            <Button className="gold-button flex items-center gap-2 h-auto py-3">
              <FileMinus size={18} />
              Despesas
            </Button>
          </div>
        </section>

        {/* Alerta/Destaque */}
        <div className="mt-8 p-4 bg-poker-red bg-opacity-10 rounded-lg border border-poker-red">
          <p className="text-sm text-poker-red font-medium">
            Torneio importante em breve! Não se esqueça de confirmar sua presença até amanhã.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
