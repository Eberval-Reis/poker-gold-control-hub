
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateTotalInvested, calculateProfitLoss } from '@/components/tournament-performance/TournamentPerformanceFormSchema';

interface TournamentBarChartProps {
  performances: any[];
  tournaments: any[];
}

const TournamentBarChart = ({ performances, tournaments }: TournamentBarChartProps) => {
  const chartData = useMemo(() => {
    // Filter performances that have prize amount > 0
    const performancesWithPrizes = performances.filter(performance => 
      Number(performance.prize_amount || 0) > 0
    );

    // Get the 5 most recent performances with prizes
    const recentPerformances = [...performancesWithPrizes]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return recentPerformances.map(performance => {
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
      
      return {
        name: tournamentName,
        value: profitLoss,
        totalInvested,
        prizeAmount
      };
    }).reverse(); // Reverse to show oldest first
  }, [performances, tournaments]);

  // Array of colors for different tournaments
  const colors = ['#006400', '#d4af37', '#0088FE', '#00C49F', '#FF8042'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" 
            tickFormatter={(value) => `R$ ${value}`} 
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Resultado"]}
            labelFormatter={(label) => `Torneio: ${label}`}
          />
          <Bar dataKey="value" minPointSize={2}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TournamentBarChart;
