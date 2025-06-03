
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { expenseTypes } from '@/components/expense/ExpenseFormSchema';

interface ExpenseDistributionChartProps {
  expenses: any[];
}

const ExpenseDistributionChart = ({ expenses }: ExpenseDistributionChartProps) => {
  const chartData = useMemo(() => {
    console.log('All expenses received:', expenses);
    console.log('Available expense types from schema:', expenseTypes);
    
    if (!expenses || expenses.length === 0) {
      console.log('No expenses data available');
      return [];
    }
    
    // Group expenses by type
    const expensesByType = {};
    
    expenses.forEach((expense, index) => {
      console.log(`Processing expense ${index}:`, expense);
      const { type, amount } = expense;
      
      if (!type) {
        console.warn('Expense without type found:', expense);
        return;
      }
      
      if (!expensesByType[type]) {
        expensesByType[type] = 0;
      }
      const numericAmount = Number(amount) || 0;
      expensesByType[type] += numericAmount;
      
      console.log(`Added ${numericAmount} to type '${type}'. New total:`, expensesByType[type]);
    });
    
    console.log('Final expenses grouped by type:', expensesByType);
    
    // Convert to array for chart and map type IDs to display names
    const chartData = Object.entries(expensesByType)
      .filter(([typeId, amount]) => Number(amount) > 0) // Only include types with positive amounts
      .map(([typeId, amount]) => {
        // Find expense type info from the defined types
        const typeInfo = expenseTypes.find(t => t.id === typeId);
        console.log(`Mapping type '${typeId}' to display name. Found:`, typeInfo);
        
        const displayName = typeInfo ? typeInfo.name : typeId;
        const result = {
          name: displayName,
          value: Number(amount),
          originalType: typeId // Keep original type for debugging
        };
        
        console.log('Created chart entry:', result);
        return result;
      })
      .sort((a, b) => b.value - a.value); // Sort by value in descending order
    
    console.log('Final chart data for rendering:', chartData);
    return chartData;
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
