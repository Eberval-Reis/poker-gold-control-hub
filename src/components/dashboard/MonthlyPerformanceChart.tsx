
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MonthlyPerformanceChartProps {
  data: { month: string; profit: number }[];
}

const MonthlyPerformanceChart = ({ data }: MonthlyPerformanceChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `R$ ${value}`} />
          <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, ""]} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="profit" 
            name="Lucro" 
            stroke="#006400" 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyPerformanceChart;
