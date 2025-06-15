
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ExpenseDistributionChartProps {
  data: { category: string; amount: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#d4af37'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact'
  }).format(value);
};

const ExpenseDistributionChart = ({ data }: ExpenseDistributionChartProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Despesas acumuladas por categoria</h3>
      <div className="h-[300px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <XAxis type="number" tickFormatter={formatCurrency} />
              <YAxis dataKey="category" type="category" scale="band" width={120} />
              <Tooltip
                formatter={(value: number) =>
                  [formatCurrency(value), "Total acumulado"]
                }
              />
              <Bar dataKey="amount" fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Não há dados de despesas para exibir</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseDistributionChart;
