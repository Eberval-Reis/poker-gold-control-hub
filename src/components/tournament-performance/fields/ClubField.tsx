import { UseFormReturn } from 'react-hook-form';
import { Tournament } from '@/lib/supabase';
import { TournamentPerformanceFormData } from '../TournamentPerformanceFormSchema';
import {
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface ClubFieldProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
  tournaments: Tournament[];
}

const ClubField = ({ form, tournaments }: ClubFieldProps) => {
  const selectedTournamentId = form.watch('tournament_id');
  const clubId = form.watch('club_id');
  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);

  // Function to get club name - prioritize direct club_id, fallback to tournament's club
  const getClubName = () => {
    // If we have a direct club_id stored, try to find it from the selected tournament
    if (clubId && selectedTournament?.clubs && 'id' in selectedTournament.clubs && (selectedTournament.clubs as Record<string, unknown>).id === clubId) {
      return selectedTournament.clubs.name;
    }

    // Fallback to tournament's club
    if (selectedTournament?.clubs?.name) {
      return selectedTournament.clubs.name;
    }

    // If loading
    if (selectedTournamentId && tournaments.length > 0) {
      return 'Carregando...';
    }

    return '';
  };

  return (
    <FormItem>
      <FormLabel>Clube</FormLabel>
      <FormControl>
        <Input
          value={getClubName()}
          placeholder="Clube será preenchido automaticamente"
          readOnly
          className="bg-muted text-muted-foreground"
        />
      </FormControl>
    </FormItem>
  );
};

export default ClubField;