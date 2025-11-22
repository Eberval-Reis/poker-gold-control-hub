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

  // Determinar o intervalo de classes
  const minProfit = Math.min(...profits);
  const maxProfit = Math.max(...profits);
  const classWidth = 100; // R$100

  // Criar limites das classes
  const minClass = Math.floor(minProfit / classWidth) * classWidth;
  const maxClass = Math.ceil(maxProfit / classWidth) * classWidth;

  // Agrupar lucros em classes e calcular frequência acumulada
  const classes: { upperLimit: number; cumulativeFreq: number }[] = [];
  let cumulativeCount = 0;

  for (let limit = minClass + classWidth; limit <= maxClass; limit += classWidth) {
    // Contar quantos lucros estão até este limite superior
    const count = profits.filter(p => p <= limit).length;
    
    classes.push({
      upperLimit: limit,
      cumulativeFreq: count,
    });
  }

  // Encontrar o valor acumulado no break-even (X=0)
  const breakEvenFreq = profits.filter(p => p <= 0).length;

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
              dataKey="upperLimit"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              label={!isMobile ? { 
                value: 'Lucro por Torneio (R$)', 
                position: 'insideBottom', 
                offset: -5,
                style: { fontSize: 12 }
              } : undefined}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 40 : 60}
              label={!isMobile ? { 
                value: 'Nº de Torneios Acumulados', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12 }
              } : undefined}
            />
            <Tooltip 
              formatter={(value) => [`${value} torneios`, ""]} 
              labelFormatter={(label) => `Até R$ ${label}`}
            />
            <ReferenceLine 
              x={0} 
              stroke="#dc2626" 
              strokeWidth={2}
              strokeDasharray="5 5"
              label={!isMobile ? { 
                value: `Break-Even (${breakEvenFreq} torneios)`, 
                position: 'top',
                fill: '#dc2626',
                fontSize: 11
              } : undefined}
            />
            <Line 
              type="monotone" 
              dataKey="cumulativeFreq" 
              name="Torneios Acumulados" 
              stroke="#0088FE" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-sm text-gray-600 text-center">
        A linha vermelha tracejada indica o ponto de equilíbrio (Break-Even) onde o lucro é zero
      </div>
    </div>
  );
};

export default OgiveChart;
