
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FinalTablePerformance } from '@/services/final-table.service';
import { X } from 'lucide-react';

interface FinalTableFiltersProps {
  filters: {
    tournament: string;
    buyin: string;
    position: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  allPerformances: FinalTablePerformance[];
}

const FinalTableFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  allPerformances 
}: FinalTableFiltersProps) => {
  // Extrair valores únicos para os selects
  const uniqueTournaments = Array.from(
    new Set(allPerformances.map(p => p.tournaments?.name).filter(Boolean))
  ).sort();

  const uniqueBuyins = Array.from(
    new Set(allPerformances.map(p => p.buyin_amount).filter(Boolean))
  ).sort((a, b) => a - b);

  const uniquePositions = Array.from(
    new Set(allPerformances.map(p => p.position).filter(Boolean))
  ).sort((a, b) => a - b);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Torneio
          </label>
          <Select value={filters.tournament} onValueChange={(value) => onFilterChange('tournament', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um torneio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os torneios</SelectItem>
              {uniqueTournaments.map((tournament) => (
                <SelectItem key={tournament} value={tournament || ''}>
                  {tournament}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buy-in (R$)
          </label>
          <Select value={filters.buyin} onValueChange={(value) => onFilterChange('buyin', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione buy-in" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os buy-ins</SelectItem>
              {uniqueBuyins.map((buyin) => (
                <SelectItem key={buyin} value={buyin.toString()}>
                  R$ {buyin.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colocação
          </label>
          <Select value={filters.position} onValueChange={(value) => onFilterChange('position', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Colocação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {uniquePositions.map((position) => (
                <SelectItem key={position} value={position.toString()}>
                  {position}º lugar
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
      </div>
    </div>
  );
};

export default FinalTableFilters;
