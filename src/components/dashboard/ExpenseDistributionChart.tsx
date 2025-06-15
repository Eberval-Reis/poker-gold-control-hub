
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface ExpenseDistributionChartProps {
  data: { category: string; amount: number }[];
}

// Mesmas cores do gráfico de premiação
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#d4af37'];

const formatCurrency = (value: number) => {
  return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const ExpenseDistributionChart = ({ data }: ExpenseDistributionChartProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Despesas acumuladas por categoria</h3>
      <div className="h-[300px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }} // Igual ao gráfico de premiação
              barSize={38}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={formatCurrency}
                tick={{ fill: "#4B5563", fontSize: 15 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="category"
                type="category"
                width={120}
                tick={{ fontSize: 14, fill: "#374151" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value as number), "Total acumulado"]}
                labelFormatter={label => label}
                wrapperClassName="!rounded-lg !shadow"
              />
              <Bar dataKey="amount" minPointSize={2} radius={[6, 6, 6, 6]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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

