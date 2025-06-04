
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import TournamentPerformanceTabs from '@/components/tournament-performance/list/TournamentPerformanceTabs';
import { useNavigate } from 'react-router-dom';
import { useTournamentPerformanceList } from '@/hooks/useTournamentPerformanceList';
import DeleteTournamentDialog from '@/components/tournament-performance/list/DeleteTournamentDialog';

const TournamentPerformanceList = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const {
    performances,
    isLoading,
    deleteId,
    setDeleteId,
    handleDeleteClick,
    handleDelete,
  } = useTournamentPerformanceList();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-poker-background">
      <Sidebar />
      <Header onMenuClick={toggleSidebar} />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-poker-text-dark">Performances dos Torneios</h1>
            <p className="text-gray-600">Acompanhe todas as suas participações em torneios</p>
          </div>
          <Button 
            onClick={() => navigate('/register-tournament-performance')}
            className="bg-poker-gold hover:bg-poker-gold/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Performance
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
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TournamentPerformanceList;
