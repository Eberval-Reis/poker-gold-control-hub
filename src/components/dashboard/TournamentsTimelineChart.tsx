
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TournamentsTimelineChartProps {
  data: { name: string; date: string; buyin: number; prize: number; profit: number }[];
}

const TournamentsTimelineChart = ({ data }: TournamentsTimelineChartProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  const getBarColor = (profit: number) => {
    return profit >= 0 ? '#22c55e' : '#ef4444'; // Verde para lucro, vermelho para prejuízo
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Torneios ao Longo do Tempo</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 10, angle: -45, textAnchor: 'end' }}
              height={80}
            />
            <YAxis 
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  buyin: 'Buy-in Total',
                  prize: 'Premiação',
                  profit: 'Lucro/Prejuízo'
                };
                return [`R$ ${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, labels[name as string] || name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return `${label} - ${formatDate(data.date)}`;
                }
                return label;
              }}
            />
            <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.profit)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Lucro</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Prejuízo</span>
        </div>
      </div>
    </div>
  );
};

export default TournamentsTimelineChart;
