
import { UseFormReturn } from 'react-hook-form';
import { Tournament } from '@/lib/supabase';
import { TournamentPerformanceFormData } from '../TournamentPerformanceFormSchema';
import TournamentField from '../fields/TournamentField';
import TournamentDateField from '../fields/TournamentDateField';

interface TournamentSectionProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
  tournaments: Tournament[];
  onTournamentChange: (tournamentId: string) => void;
}

const TournamentSection = ({ form, tournaments, onTournamentChange }: TournamentSectionProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Informações do Torneio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TournamentField 
          form={form} 
          tournaments={tournaments} 
          onTournamentChange={onTournamentChange}
        />
        <TournamentDateField form={form} />
      </div>
    </div>
  );
};

export default TournamentSection;
