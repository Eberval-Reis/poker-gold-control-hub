
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { expenseTypes } from '@/components/expense/ExpenseFormSchema';

interface ExpenseDistributionChartProps {
  expenses: any[];
}

const ExpenseDistributionChart = ({ expenses }: ExpenseDistributionChartProps) => {
  const chartData = useMemo(() => {
    // Group expenses by type
    const expensesByType = {};
    
    expenses.forEach(expense => {
      const { type, amount } = expense;
      if (!expensesByType[type]) {
        expensesByType[type] = 0;
      }
      expensesByType[type] += Number(amount);
    });
    
    // Convert to array for chart and map type IDs to display names
    return Object.entries(expensesByType).map(([typeId, amount]) => {
      // Find expense type info from the defined types
      const typeInfo = expenseTypes.find(t => t.id === typeId);
      
      return {
        name: typeInfo ? typeInfo.name : typeId, // Use the display name if found, otherwise use the ID
        value: amount
      };
    }).sort((a, b) => (b.value as number) - (a.value as number)); // Sort by value in descending order
  }, [expenses]);
  
  // Colors for the bar chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#d4af37'];

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-[#8b0000]">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact'
    }).format(value);
  };

  return (
    <div className="h-[300px] w-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <XAxis type="number" tickFormatter={formatCurrency} />
            <YAxis dataKey="name" type="category" scale="band" width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
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
  );
};

export default ExpenseDistributionChart;
