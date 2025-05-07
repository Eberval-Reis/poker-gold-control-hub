
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ClubForm from '@/components/club/ClubForm';
import { clubService } from '@/services/club.service';

const RegisterClub = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { data: clubData, isLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: () => (id ? clubService.getClubById(id) : null),
    enabled: !!id,
  });
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />

      <div className="max-w-4xl mx-auto p-6">
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
              {id ? 'Editar Clube' : 'Cadastrar Clube'}
            </h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm md:w-1/2">
            <ClubForm 
              clubId={id} 
              clubData={clubData}
              isLoading={isLoading} 
            />
          </div>
          
          <div className="md:w-1/2">
            {/* Poker player image with light effect */}
            <div className="relative w-full h-auto rounded-lg overflow-hidden">
              {/* Light radial effect in background */}
              <div className="absolute inset-0 bg-gradient-to-br from-poker-gold/30 to-transparent opacity-70 z-0"></div>
              
              {/* Overlay with glow */}
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              
              {/* Image */}
              <img 
                src="/lovable-uploads/e4834ff0-8ff6-44e6-96f0-162d3201790d.png" 
                alt="Poker Player" 
                className="relative w-full h-auto object-cover z-20"
              />
              
              {/* Light rays from behind */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-poker-gold/20 blur-3xl rounded-full z-0"></div>
              
              {/* Bottom text */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-30">
                <p className="text-white font-medium text-lg">Clube de Poker Profissional</p>
                <p className="text-poker-gold text-sm">Cadastre seu clube agora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterClub;
