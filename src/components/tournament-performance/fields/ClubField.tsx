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
  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);

  // Function to get club name with fallback
  const getClubName = () => {
    if (selectedTournament?.clubs?.name) {
      return selectedTournament.clubs.name;
    }
    
    // Fallback: if we have a selected tournament ID but no club name in the tournaments list,
    // it might be because we're loading data during edit mode
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