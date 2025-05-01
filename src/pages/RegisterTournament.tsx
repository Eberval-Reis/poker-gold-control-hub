
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TournamentForm from '@/components/tournament/TournamentForm';

const RegisterTournament = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isEditing = Boolean(id);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />

      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/tournaments')}
              className="text-poker-gold hover:text-poker-gold/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-poker-text-dark">
              {isEditing ? 'Editar Torneio' : 'Cadastrar Torneio'}
            </h1>
          </div>
          <p className="text-[#5a5a5a]">
            {isEditing 
              ? 'Atualize os detalhes do torneio'
              : 'Preencha os detalhes do torneio'}
          </p>
        </div>

        <TournamentForm isEditing={isEditing} />
      </div>
    </div>
  );
};

export default RegisterTournament;
