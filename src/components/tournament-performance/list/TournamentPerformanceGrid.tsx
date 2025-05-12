
import { TournamentPerformance } from '@/lib/supabase';
import TournamentPerformanceCard from './TournamentPerformanceCard';

interface TournamentPerformanceGridProps {
  performances: TournamentPerformance[];
  isLoading: boolean;
  onDeleteClick: (id: string) => void;
}

const TournamentPerformanceGrid = ({ 
  performances, 
  isLoading, 
  onDeleteClick 
}: TournamentPerformanceGridProps) => {
  if (isLoading) {
    return <div className="text-center py-10">Carregando...</div>;
  }

  if (performances.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Nenhum registro de desempenho encontrado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {performances.map((performance) => (
        <TournamentPerformanceCard
          key={performance.id}
          performance={performance}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default TournamentPerformanceGrid;
