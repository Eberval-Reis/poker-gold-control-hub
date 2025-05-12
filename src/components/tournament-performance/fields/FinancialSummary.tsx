
interface FinancialSummaryProps {
  summary: {
    totalInvested: number;
    profitLoss: number;
    roi: number;
  };
}

const FinancialSummary = ({ summary }: FinancialSummaryProps) => {
  const { totalInvested, profitLoss, roi } = summary;
  
  // Determine profit/loss color
  const profitLossColor = profitLoss >= 0 ? 'text-[#006400]' : 'text-[#8b0000]';
  
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium mb-1">Total Investido:</div>
          <div className="p-2 bg-gray-100 rounded">
            <span className="text-gray-700 font-medium">R$ {totalInvested.toFixed(2)}</span>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-1">Lucro/Prejuízo:</div>
          <div className="p-2 bg-gray-100 rounded">
            <span className={`font-medium ${profitLossColor}`}>
              R$ {profitLoss.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <div className="text-sm font-medium mb-1">ROI (Return on Investment):</div>
        <div className="p-2 bg-gray-100 rounded">
          <span className={`font-medium ${profitLossColor}`}>
            {roi.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
