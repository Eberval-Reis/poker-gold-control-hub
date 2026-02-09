
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface TournamentBarChartProps {
  data: { month: string; profit: number }[];
}

const TournamentBarChart = ({ data }: TournamentBarChartProps) => {
  const isMobile = useIsMobile();
  const colors = ['#C5A028', '#A00000', '#121212', '#454545', '#888888'];

  return (
    <div className="bg-card p-6 rounded-sm border border-border/40 shadow-sm animate-reveal h-full">
      <h3 className="text-sm font-bold font-montserrat uppercase tracking-widest mb-6 text-muted-foreground flex items-center gap-2">
        <div className="w-1 h-4 bg-poker-gold rounded-full" />
        Premiação Acumulada por Torneio
      </h3>
      <div className={isMobile ? "h-[450px] w-full" : "h-[300px] w-full"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={isMobile
              ? { top: 5, right: 5, left: 10, bottom: 5 }
              : { top: 5, right: 30, left: 20, bottom: 5 }
            }
            barSize={isMobile ? 25 : 30}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              type="number"
              tick={isMobile ? false : { fontSize: 10, fontFamily: 'Inter', fill: 'currentColor' }}
              tickFormatter={isMobile ? undefined : (value) => `R$ ${value.toLocaleString('pt-BR')}`}
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              dataKey="month"
              type="category"
              width={isMobile ? 100 : 120}
              tick={{ fontSize: isMobile ? 10 : 11, fontFamily: 'Inter', fontWeight: 500, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
            />
            <Tooltip
              cursor={{ fill: 'rgba(197, 160, 40, 0.05)' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '4px',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Inter',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              }}
              formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Premiação Total"]}
              labelFormatter={(label) => `Torneio: ${label}`}
            />
            <Bar dataKey="profit" radius={[0, 2, 2, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  className="transition-all duration-300 hover:brightness-110"
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
