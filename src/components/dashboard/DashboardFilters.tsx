
import { useState } from 'react';
import { CalendarDays, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface DashboardFiltersProps {
  filters: {
    timePeriod: string;
    gameType: string;
    clubId: string;
  };
  setFilters: (filters: any) => void;
  tournaments: any[];
}

// Options for time period filter
const timePeriods = [
  { value: 'all', label: 'Todos os tempos' },
  { value: 'year', label: 'Este ano' },
  { value: 'month', label: 'Este mês' },
  { value: '3months', label: 'Últimos 3 meses' }
];

// Options for game type filter
const gameTypes = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'tournament', label: 'Torneios' },
  { value: 'cash', label: 'Cash Game' }
];

const DashboardFilters = ({ filters, setFilters, tournaments }: DashboardFiltersProps) => {
  // Extract unique clubs from tournaments
  const clubs = tournaments.reduce((acc, tournament) => {
    if (tournament.clubs && !acc.some(club => club.id === tournament.clubs.id)) {
      acc.push({
        id: tournament.club_id,
        name: tournament.clubs.name
      });
    }
    return acc;
  }, []);

  const handleExportPDF = () => {
    alert('Exportação para PDF será implementada em breve!');
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-wrap">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <Select
              value={filters.timePeriod}
              onValueChange={(value) => setFilters({...filters, timePeriod: value})}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.gameType}
              onValueChange={(value) => setFilters({...filters, gameType: value})}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Tipo de Jogo" />
              </SelectTrigger>
              <SelectContent>
                {gameTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.clubId}
              onValueChange={(value) => setFilters({...filters, clubId: value})}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Clube" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clubes</SelectItem>
                {clubs.map((club) => (
                  <SelectItem key={club.id} value={club.id}>
                    {club.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline"
            className="bg-white border-[#d4af37] text-[#d4af37] hover:text-[#d4af37] hover:bg-[#d4af37]/10"
            onClick={handleExportPDF}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFilters;
