
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
    
    // Convert to array for chart
    return Object.entries(expensesByType).map(([type, amount]) => {
      // Find expense type info from the defined types
      const typeInfo = expenseTypes.find(t => t.id === type) || { name: type };
      
      return {
        name: typeInfo.name,
        value: amount
      };
    });
  }, [expenses]);
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#d4af37'];

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
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

  return (
    <div className="h-[300px] w-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
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
