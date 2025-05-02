
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const RegisterClub = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />

      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-poker-gold hover:text-poker-gold/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-poker-text-dark">
              Cadastrar Clube
            </h1>
          </div>
          <p className="text-[#5a5a5a]">
            Supabase foi desconectado. Este formulário não está funcional.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p>A integração com o Supabase foi removida.</p>
          <p className="mt-4">Para restaurar a funcionalidade, você precisará reconectar o Supabase.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterClub;
