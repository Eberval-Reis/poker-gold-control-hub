
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TournamentBarChartProps {
  data: { month: string; profit: number }[];
}

const TournamentBarChart = ({ data }: TournamentBarChartProps) => {
  const colors = ['#006400', '#d4af37', '#0088FE', '#00C49F', '#FF8042'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" 
            tickFormatter={(value) => `R$ ${value}`} 
          />
          <YAxis 
            dataKey="month" 
            type="category" 
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Resultado"]}
            labelFormatter={(label) => `Mês: ${label}`}
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
  );
};

export default TournamentBarChart;
