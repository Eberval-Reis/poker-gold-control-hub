
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateTotalInvested } from '@/components/tournament-performance/TournamentPerformanceFormSchema';

interface MonthlyPerformanceChartProps {
  performances: any[];
}

const MonthlyPerformanceChart = ({ performances }: MonthlyPerformanceChartProps) => {
  const chartData = useMemo(() => {
    // Get current date and previous months
    const now = new Date();
    const monthsToShow = 6;
    const months = Array.from({ length: monthsToShow }, (_, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (monthsToShow - 1 - i));
      return {
        month: d.toLocaleString('pt-BR', { month: 'short' }),
        year: d.getFullYear(),
        date: d,
        monthYear: `${d.getMonth()}-${d.getFullYear()}`
      };
    });

    // Group performances by month
    const performancesByMonth = months.map(monthData => {
      const monthPerformances = performances.filter(perf => {
        const perfDate = new Date(perf.created_at);
        return perfDate.getMonth() === monthData.date.getMonth() && 
               perfDate.getFullYear() === monthData.date.getFullYear();
      });

      let buyins = 0;
      let prizes = 0;
      let profit = 0;

      monthPerformances.forEach(perf => {
        const buyinAmount = Number(perf.buyin_amount || 0);
        const rebuyAmount = Number(perf.rebuy_amount || 0);
        const rebuyQuantity = Number(perf.rebuy_quantity || 0);
        const addonEnabled = Boolean(perf.addon_enabled);
        const addonAmount = Number(perf.addon_amount || 0);
        const prizeAmount = Number(perf.prize_amount || 0);
        
        const totalInvested = calculateTotalInvested(
          buyinAmount, 
          rebuyAmount, 
          rebuyQuantity, 
          addonEnabled, 
          addonAmount
        );
        
        buyins += totalInvested;
        prizes += prizeAmount;
        profit += (prizeAmount - totalInvested);
      });

      return {
        name: monthData.month,
        buyins: buyins.toFixed(2),
        prizes: prizes.toFixed(2),
        profit: profit.toFixed(2)
      };
    });

    return performancesByMonth;
  }, [performances]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `R$ ${value}`} />
          <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, ""]} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="buyins" 
            name="Buy-ins" 
            stroke="#8b0000" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="prizes" 
            name="Prêmios" 
            stroke="#d4af37" 
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            name="Lucro" 
            stroke="#006400" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyPerformanceChart;
