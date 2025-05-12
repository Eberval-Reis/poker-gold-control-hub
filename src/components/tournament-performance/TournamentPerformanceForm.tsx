
import { Form } from '@/components/ui/form';

import { useTournamentPerformanceForm } from './hooks/useTournamentPerformanceForm';
import TournamentSection from './sections/TournamentSection';
import CostsSection from './sections/CostsSection';
import ResultsSection from './sections/ResultsSection';
import FinancialSection from './sections/FinancialSection';
import FormActions from './fields/FormActions';

const TournamentPerformanceForm = () => {
  const {
    form,
    financialSummary,
    isEditing,
    onSubmit,
    handleTournamentChange,
    tournaments,
    isPending
  } = useTournamentPerformanceForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Tournament section */}
        <TournamentSection 
          form={form} 
          tournaments={tournaments} 
          onTournamentChange={handleTournamentChange} 
        />
        
        {/* Costs section */}
        <CostsSection form={form} />
        
        {/* Results section */}
        <ResultsSection form={form} />
        
        {/* Financial summary */}
        <FinancialSection summary={financialSummary} />
        
        {/* Form actions */}
        <FormActions 
          isSubmitting={isPending} 
          isEditing={isEditing} 
          onCancel={() => window.location.href = '/tournament-performances'} 
        />
      </form>
    </Form>
  );
};

export default TournamentPerformanceForm;
