
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

import { PokerPerformance } from '@/types';

interface PrizeBarChartProps {
  performances: PokerPerformance[];
}

// Paleta "Sunset no Casino"
const colors = ['#FFD700', '#FF8C42', '#FF6B6B', '#8B4B8C', '#2C1810'];

const PrizeBarChart: React.FC<PrizeBarChartProps> = ({ performances }) => {
  if (!performances || performances.length === 0) {
    return (
      <div className="text-muted-foreground text-center mb-2">
        Nenhum torneio no período selecionado.
      </div>
    );
  }

  const data = performances.map((perf, idx: number) => ({
    name: perf.tournaments?.name || `Torneio ${idx + 1}`,
    prize: Number(perf.prize_amount || 0)
  }))
    // Ordena da maior premiação para a menor
    .sort((a, b) => b.prize - a.prize);

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">Premiação Bruta por Torneio</h4>
      <ChartContainer config={{ prize: { color: "#d4af37", label: "Premiação (R$)" } }}>
        <ResponsiveContainer width="100%" height={Math.max(120, data.length * 35)}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={value => `R$ ${value.toLocaleString('pt-BR')}`}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={value => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Premiação"]}
              labelFormatter={label => `Torneio: ${label}`}
            />
            <Bar dataKey="prize" minPointSize={2}>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default PrizeBarChart;

