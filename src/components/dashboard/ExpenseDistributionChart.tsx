
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ExpenseDistributionChartProps {
  data: { category: string; amount: number }[];
}

// Mesmas cores do gráfico de premiação
const COLORS = ['#C5A028', '#A00000', '#121212', '#454545', '#888888', '#D4AF37'];

const formatCurrency = (value: number) => {
  return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const ExpenseDistributionChart = ({ data }: ExpenseDistributionChartProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-card p-6 rounded-sm border border-border/40 shadow-sm animate-reveal h-full">
      <h3 className="text-sm font-bold font-montserrat uppercase tracking-widest mb-6 text-muted-foreground flex items-center gap-2">
        <div className="w-1 h-4 bg-poker-gold rounded-full" />
        Despesas acumuladas por categoria
      </h3>
      <div className={isMobile ? "h-[450px] w-full" : "h-[300px] w-full"}>
        {data.length > 0 ? (
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
                tick={isMobile ? false : { fill: "hsl(var(--muted-foreground))", fontSize: 10, fontFamily: 'Inter' }}
                tickFormatter={isMobile ? undefined : formatCurrency}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="category"
                type="category"
                width={isMobile ? 100 : 120}
                tick={{ fontSize: isMobile ? 10 : 11, fill: "hsl(var(--foreground))", fontFamily: 'Inter', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
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
                formatter={(value) => [formatCurrency(value as number), "Total acumulado"]}
                labelFormatter={label => label}
              />
              <Bar dataKey="amount" minPointSize={2} radius={[0, 2, 2, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300 hover:brightness-110"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground italic font-sans">Não há dados de despesas para exibir</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseDistributionChart;

