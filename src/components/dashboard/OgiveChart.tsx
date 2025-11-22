import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface OgiveChartProps {
  performances: any[];
}

const OgiveChart = ({ performances }: OgiveChartProps) => {
  const isMobile = useIsMobile();

  // Calcular lucro de cada torneio
  const profits = performances.map((perf) => {
    const buyin = Number(perf.buyin_amount || 0);
    const rebuy = Number(perf.rebuy_amount || 0) * Number(perf.rebuy_quantity || 0);
    const addon = perf.addon_enabled ? Number(perf.addon_amount || 0) : 0;
    const prize = Number(perf.prize_amount || 0);
    
    const investment = buyin + rebuy + addon;
    const profit = prize - investment;
    
    return profit;
  });

  const totalTournaments = profits.length || 1; // Evitar divisão por zero

  // Definir classes fixas
  const classLimits = [
    { label: 'R$-200', upperLimit: -200 },
    { label: 'R$-100', upperLimit: -100 },
    { label: 'R$0', upperLimit: 0 },
    { label: 'R$100', upperLimit: 100 },
    { label: 'R$200', upperLimit: 200 },
    { label: 'R$300+', upperLimit: 300 },
  ];

  // Calcular frequência acumulada relativa (percentual)
  const classes = classLimits.map(({ label, upperLimit }) => {
    const count = profits.filter(p => p <= upperLimit).length;
    const percentage = (count / totalTournaments) * 100;
    
    return {
      label,
      upperLimit,
      cumulativeFreqPercent: percentage,
    };
  });

  // Encontrar o percentual no break-even (X=0)
  const breakEvenCount = profits.filter(p => p <= 0).length;
  const breakEvenPercent = ((breakEvenCount / totalTournaments) * 100).toFixed(1);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Gráfico de Ogiva - Frequência Acumulada do Lucro em Torneios</h3>
      <div className={isMobile ? "h-[400px] w-full" : "h-[300px] w-full"}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={classes}
            margin={isMobile 
              ? { top: 5, right: 10, left: 0, bottom: 5 }
              : { top: 5, right: 30, left: 20, bottom: 5 }
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="label"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              label={!isMobile ? { 
                value: 'Limite Superior da Classe (Resultado Líquido)', 
                position: 'insideBottom', 
                offset: -5,
                style: { fontSize: 12 }
              } : undefined}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 40 : 60}
              label={!isMobile ? { 
                value: 'Frequência Acumulada Relativa (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12 }
              } : undefined}
              domain={[0, 100]}
            />
            <Tooltip 
              formatter={(value) => [`${Number(value).toFixed(1)}%`, ""]} 
              labelFormatter={(label) => `${label}`}
            />
            <ReferenceLine 
              x="R$0" 
              stroke="#dc2626" 
              strokeWidth={2}
              strokeDasharray="5 5"
              label={!isMobile ? { 
                value: `Break-Even (${breakEvenPercent}%)`, 
                position: 'top',
                fill: '#dc2626',
                fontSize: 11
              } : undefined}
            />
            <Line 
              type="monotone" 
              dataKey="cumulativeFreqPercent" 
              name="Frequência Acumulada (%)" 
              stroke="#0088FE" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-sm text-gray-600 text-center">
        A linha vermelha tracejada indica o ponto de equilíbrio (Break-Even) onde o resultado líquido é zero
      </div>
    </div>
  );
};

export default OgiveChart;
