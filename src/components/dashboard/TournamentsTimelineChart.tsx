
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TournamentsTimelineChartProps {
  data: { month: string; count: number }[];
}

const TournamentsTimelineChart = ({ data }: TournamentsTimelineChartProps) => {
  const formatMonth = (dateString: string) => {
    const [year, month] = dateString.split('-');
    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return `${monthNames[parseInt(month) - 1]}/${year}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Torneios ao Longo do Tempo</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              allowDecimals={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [`${value} torneios`, "Quantidade"]}
              labelFormatter={(label) => `Período: ${formatMonth(label)}`}
            />
            <Bar 
              dataKey="count" 
              fill="#d4af37" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TournamentsTimelineChart;
