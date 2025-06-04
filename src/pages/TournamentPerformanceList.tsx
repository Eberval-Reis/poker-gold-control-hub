
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import TournamentPerformanceTabs from '@/components/tournament-performance/list/TournamentPerformanceTabs';
import DeleteTournamentDialog from '@/components/tournament-performance/list/DeleteTournamentDialog';
import { useTournamentPerformanceList } from '@/hooks/useTournamentPerformanceList';

const TournamentPerformanceList = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { 
    performances, 
    isLoading, 
    deleteId, 
    setDeleteId, 
    handleDeleteClick, 
    handleDelete 
  } = useTournamentPerformanceList();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-poker-text-dark">Desempenho em Torneios</h1>
            <p className="text-gray-600">Gerencie seus registros de desempenho em torneios</p>
          </div>
          <Button
            onClick={() => navigate('/register-tournament-performance')}
            className="bg-[#d4af37] text-white hover:bg-[#d4af37]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </div>

        <TournamentPerformanceTabs 
          performances={performances}
          isLoading={isLoading}
          onDeleteClick={handleDeleteClick}
        />
      </div>

      <DeleteTournamentDialog 
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TournamentPerformanceList;
