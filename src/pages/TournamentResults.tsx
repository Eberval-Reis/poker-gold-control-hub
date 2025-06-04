
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { TournamentResultForm } from '@/components/tournament-result/TournamentResultForm';

const TournamentResults = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-poker-text-dark">
              Resultado Torneios
            </h1>
          </div>
          <p className="text-gray-600">Registre os resultados dos torneios jogados</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <TournamentResultForm />
        </div>
      </div>
    </div>
  );
};

export default TournamentResults;
