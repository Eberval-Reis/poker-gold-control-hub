
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { clubService } from '@/services/club.service';
import ClubForm from '@/components/club/ClubForm';

const RegisterClub = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isEditing = Boolean(id);
  
  // Get club data if editing
  const { isLoading: isLoadingClub, data: clubData } = useQuery({
    queryKey: ['club', id],
    queryFn: () => clubService.getClubById(id as string),
    enabled: !!id,
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados do clube",
          description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        });
        navigate('/clubs');
      }
    }
  });
  
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
              onClick={() => navigate('/clubs')}
              className="text-poker-gold hover:text-poker-gold/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-poker-text-dark">
              {isEditing ? 'Editar Clube' : 'Cadastrar Clube'}
            </h1>
          </div>
          <p className="text-[#5a5a5a]">
            {isEditing 
              ? 'Atualize os dados do clube'
              : 'Informe os dados básicos e adicionais (opcionais)'}
          </p>
        </div>

        <ClubForm 
          clubId={id} 
          clubData={clubData} 
          isLoading={isLoadingClub} 
        />
      </div>
    </div>
  );
};

export default RegisterClub;
