
import { UseFormReturn } from 'react-hook-form';
import { Tournament } from '@/lib/supabase';
import { TournamentPerformanceFormData } from '../TournamentPerformanceFormSchema';
import TournamentField from '../fields/TournamentField';
import TournamentDateField from '../fields/TournamentDateField';
import ClubField from '../fields/ClubField';

interface TournamentSectionProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
  tournaments: Tournament[];
  onTournamentChange: (tournamentId: string) => void;
}

const TournamentSection = ({ form, tournaments, onTournamentChange }: TournamentSectionProps) => {
  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-6 text-foreground">Informações do Torneio</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TournamentField 
            form={form} 
            tournaments={tournaments} 
            onTournamentChange={onTournamentChange}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <TournamentDateField form={form} />
          <ClubField form={form} tournaments={tournaments} />
        </div>
      </div>
    </div>
  );
};

export default TournamentSection;
