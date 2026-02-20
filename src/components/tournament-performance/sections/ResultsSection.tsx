
import { UseFormReturn } from 'react-hook-form';
import { TournamentPerformanceFormData } from '../TournamentPerformanceFormSchema';
import ResultsFields from '../fields/ResultsFields';

interface ResultsSectionProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
}

const ResultsSection = ({ form }: ResultsSectionProps) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border">
      <h2 className="text-lg font-medium mb-4 text-foreground">Resultados</h2>
      <ResultsFields form={form} />
    </div>
  );
};

export default ResultsSection;
