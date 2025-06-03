
import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { calculateTotalInvested, calculateProfitLoss, calculateROI } from '@/components/tournament-performance/TournamentPerformanceFormSchema';

interface RecentTournamentsTableProps {
  performances: any[];
  tournaments: any[];
}

const RecentTournamentsTable = ({ performances, tournaments }: RecentTournamentsTableProps) => {
  const tableData = useMemo(() => {
    // Get the 5 most recent performances
    return [...performances]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(performance => {
        // Access the tournament name directly from the nested structure
        const tournamentName = performance.tournament_id?.name || 'Torneio desconhecido';
        
        const buyinAmount = Number(performance.buyin_amount || 0);
        const rebuyAmount = Number(performance.rebuy_amount || 0);
        const rebuyQuantity = Number(performance.rebuy_quantity || 0);
        const addonEnabled = Boolean(performance.addon_enabled);
        const addonAmount = Number(performance.addon_amount || 0);
        const prizeAmount = Number(performance.prize_amount || 0);
        
        const totalInvested = calculateTotalInvested(
          buyinAmount, 
          rebuyAmount, 
          rebuyQuantity, 
          addonEnabled, 
          addonAmount
        );
        
        const profitLoss = calculateProfitLoss(prizeAmount, totalInvested);
        const roi = calculateROI(profitLoss, totalInvested);
        
        const date = new Date(performance.created_at).toLocaleDateString('pt-BR');
        
        return {
          date,
          tournamentName,
          buyinAmount,
          rebuyTotal: rebuyAmount * rebuyQuantity,
          prizeAmount,
          profitLoss,
          roi,
          id: performance.id
        };
      });
  }, [performances, tournaments]);

  // Helper to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Data</th>
            <th className="text-left p-2">Torneio</th>
            <th className="text-right p-2">Buy-in</th>
            <th className="text-right p-2">Prêmio</th>
            <th className="text-right p-2">Resultado</th>
            <th className="text-right p-2">ROI</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((item, index) => (
              <tr key={item.id} className={`hover:bg-gray-50 ${index < tableData.length - 1 ? 'border-b' : ''}`}>
                <td className="p-2 text-sm">{item.date}</td>
                <td className="p-2 text-sm font-medium">{item.tournamentName}</td>
                <td className="p-2 text-sm text-right">{formatCurrency(item.buyinAmount)}</td>
                <td className="p-2 text-sm text-right">{formatCurrency(item.prizeAmount)}</td>
                <td className="p-2 text-sm text-right font-medium">
                  <div className="flex items-center justify-end gap-1">
                    {item.profitLoss >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-[#006400]" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-[#8b0000]" />
                    )}
                    <span className={item.profitLoss >= 0 ? 'text-[#006400]' : 'text-[#8b0000]'}>
                      {formatCurrency(item.profitLoss)}
                    </span>
                  </div>
                </td>
                <td className="p-2 text-sm text-right">
                  <span className={item.roi >= 0 ? 'text-[#006400]' : 'text-[#8b0000]'}>
                    {item.roi.toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                Nenhum registro de torneio encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTournamentsTable;
