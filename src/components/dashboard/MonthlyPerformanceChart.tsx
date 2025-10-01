import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface MonthlyPerformanceChartProps {
  data: { month: string; profit: number }[];
}

const MonthlyPerformanceChart = ({ data }: MonthlyPerformanceChartProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? "h-[400px] w-full" : "h-[300px] w-full"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={isMobile 
            ? { top: 5, right: 10, left: 0, bottom: 5 }
            : { top: 5, right: 30, left: 20, bottom: 5 }
          }
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: isMobile ? 10 : 12 }}
          />
          <YAxis 
            tickFormatter={isMobile ? (value) => `${value}` : (value) => `R$ ${value}`}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 40 : 60}
          />
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
