
import FinancialSummary from '../fields/FinancialSummary';

interface FinancialSectionProps {
  summary: {
    totalInvested: number;
    profitLoss: number;
    roi: number;
  };
}

const FinancialSection = ({ summary }: FinancialSectionProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Resumo Financeiro</h2>
      <FinancialSummary summary={summary} />
    </div>
  );
};

export default FinancialSection;
