
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TournamentBarChartProps {
  data: { month: string; profit: number }[];
}

const TournamentBarChart = ({ data }: TournamentBarChartProps) => {
  const colors = ['#006400', '#d4af37', '#0088FE', '#00C49F', '#FF8042'];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Premiação Acumulada por Torneio</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis 
              type="number" 
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} 
            />
            <YAxis 
              dataKey="month" 
              type="category" 
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, "Premiação Total"]}
              labelFormatter={(label) => `Torneio: ${label}`}
            />
            <Bar dataKey="profit" minPointSize={2}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TournamentBarChart;
