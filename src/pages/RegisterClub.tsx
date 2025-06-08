
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
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-poker-background">
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

              <div className="bg-white rounded-lg p-6 shadow-sm mx-auto max-w-2xl">
                <ClubForm 
                  clubId={id} 
                  clubData={clubData}
                  isLoading={isLoading} 
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RegisterClub;
