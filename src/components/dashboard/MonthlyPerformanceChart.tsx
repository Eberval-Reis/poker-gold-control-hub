import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface MonthlyPerformanceChartProps {
  data: { month: string; profit: number }[];
}

const MonthlyPerformanceChart = ({ data }: MonthlyPerformanceChartProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-card p-6 rounded-sm border border-border/40 shadow-sm animate-reveal h-full">
      <h3 className="text-sm font-bold font-montserrat uppercase tracking-widest mb-6 text-muted-foreground flex items-center gap-2">
        <div className="w-1 h-4 bg-poker-red rounded-full" />
        Performance Mensal
      </h3>
      <div className={isMobile ? "h-[350px] w-full" : "h-[250px] w-full"}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={isMobile
              ? { top: 5, right: 10, left: 0, bottom: 5 }
              : { top: 5, right: 30, left: 20, bottom: 5 }
            }
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fontFamily: 'Inter', fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              tickFormatter={(value) => `R$ ${value}`}
              tick={{ fontSize: 10, fontFamily: 'Inter', fill: 'currentColor' }}
              width={isMobile ? 40 : 60}
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '4px',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Inter',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              }}
              formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Lucro Mensal"]}
            />
            <Line
              type="monotone"
              dataKey="profit"
              name="Lucro"
              stroke="#A00000"
              strokeWidth={3}
              dot={{ r: 4, fill: '#A00000', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyPerformanceChart;
