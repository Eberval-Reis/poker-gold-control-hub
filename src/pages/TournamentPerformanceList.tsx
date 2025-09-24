
import { useTournamentPerformanceList } from '@/hooks/useTournamentPerformanceList';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { usePagination } from '@/hooks/usePagination';
import TournamentPerformanceTabs from '@/components/tournament-performance/list/TournamentPerformanceTabs';
import DeleteTournamentDialog from '@/components/tournament-performance/list/DeleteTournamentDialog';
import CSVImportDialog from '@/components/csv-import/CSVImportDialog';

const TournamentPerformanceList = () => {
  const navigate = useNavigate();
  const { 
    performances, 
    isLoading, 
    deleteId, 
    setDeleteId, 
    handleDeleteClick, 
    handleDelete,
    refetch
  } = useTournamentPerformanceList();

  const pagination = usePagination(performances, 12);

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full flex flex-col p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-poker-text-dark truncate">Desempenho em Torneios</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Gerencie seus registros de desempenho em torneios</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <CSVImportDialog onImportComplete={refetch} />
            <Button
              onClick={() => navigate('/register-tournament-performance')}
              className="bg-[#d4af37] text-white hover:bg-[#d4af37]/90"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Novo Registro</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <TournamentPerformanceTabs 
            performances={pagination.paginatedData}
            isLoading={isLoading}
            onDeleteClick={handleDeleteClick}
          />
        </div>

        {performances.length > 0 && (
          <div className="mt-4 flex-shrink-0">
            <PaginationControls pagination={pagination} />
          </div>
        )}

        <DeleteTournamentDialog 
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
};

export default TournamentPerformanceList;

