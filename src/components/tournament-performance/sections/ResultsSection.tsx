
import { UseFormReturn } from 'react-hook-form';
import { TournamentPerformanceFormData } from '../TournamentPerformanceFormSchema';
import ResultsFields from '../fields/ResultsFields';

interface ResultsSectionProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
}

const ResultsSection = ({ form }: ResultsSectionProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Resultados</h2>
      <ResultsFields form={form} />
    </div>
  );
};

export default ResultsSection;
