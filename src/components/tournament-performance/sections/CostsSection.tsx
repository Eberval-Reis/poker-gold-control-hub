
import { UseFormReturn } from 'react-hook-form';
import { TournamentPerformanceFormData } from '../TournamentPerformanceFormSchema';
import BuyinField from '../fields/BuyinField';
import RebuyFields from '../fields/RebuyFields';
import AddonFields from '../fields/AddonFields';

interface CostsSectionProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
}

const CostsSection = ({ form }: CostsSectionProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Custos</h2>
      <div className="space-y-4">
        <BuyinField form={form} />
        <RebuyFields form={form} />
        <AddonFields form={form} />
      </div>
    </div>
  );
};

export default CostsSection;
