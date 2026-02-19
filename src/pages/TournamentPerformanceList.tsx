
import { useState, useMemo } from 'react';
import { useTournamentPerformanceList } from '@/hooks/useTournamentPerformanceList';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { usePagination } from '@/hooks/usePagination';
import TournamentPerformanceTabs from '@/components/tournament-performance/list/TournamentPerformanceTabs';
import DeleteTournamentDialog from '@/components/tournament-performance/list/DeleteTournamentDialog';
import CSVImportDialog from '@/components/csv-import/CSVImportDialog';

const TournamentPerformanceList = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  const { 
    performances, 
    isLoading, 
    deleteId, 
    setDeleteId, 
    handleDeleteClick, 
    handleDelete,
    refetch
  } = useTournamentPerformanceList();

  // Extract unique years from performances
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    performances.forEach((p) => {
      if (p.tournament_date) {
        const year = new Date(p.tournament_date).getFullYear().toString();
        years.add(year);
      }
    });
    // Always include current year
    years.add(currentYear);
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [performances, currentYear]);

  // Filter performances by selected year
  const filteredPerformances = useMemo(() => {
    if (selectedYear === 'all') return performances;
    return performances.filter((p) => {
      if (!p.tournament_date) return false;
      return new Date(p.tournament_date).getFullYear().toString() === selectedYear;
    });
  }, [performances, selectedYear]);

  const pagination = usePagination(filteredPerformances, 12);

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full flex flex-col p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">Desempenho em Torneios</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Gerencie seus registros de desempenho em torneios</p>
          </div>
          <div className="flex gap-2 flex-shrink-0 items-center">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CSVImportDialog onImportComplete={refetch} />
            <Button
              onClick={() => navigate('/register-tournament-performance')}
              className="bg-poker-gold text-white hover:bg-poker-gold/90"
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
            performances={pagination.paginatedData as any}
            isLoading={isLoading}
            onDeleteClick={handleDeleteClick}
          />
        </div>

        {filteredPerformances.length > 0 && (
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
