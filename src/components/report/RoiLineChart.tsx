
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

/**
 * Cálculo do ROI do torneio:
 * (prize_amount - investido) / investido * 100
 * Investido = buyin + (rebuy_amount * rebuy_quantity) + addon_amount (se houver)
 */
function calcularInvestido(perf: any) {
  return (
    Number(perf.buyin_amount || 0) +
    Number(perf.rebuy_amount || 0) * Number(perf.rebuy_quantity || 0) +
    Number(perf.addon_amount || 0)
  );
}

const RoiLineChart = ({ performances }: { performances: any[] }) => {
  const data = performances.map((perf, idx) => {
    const investido = calcularInvestido(perf);
    const premio = Number(perf.prize_amount || 0);
    const roi =
      investido > 0 ? ((premio - investido) / investido) * 100 : 0;
    return {
      name: perf.tournaments?.name || `Torneio ${idx + 1}`,
      roi: Number(roi.toFixed(2)),
    };
  });

  // Não mostra o gráfico se não houver dados suficientes
  if (data.length === 0) return (
    <div className="text-muted-foreground text-center mb-4">
      Nenhum torneio no período selecionado.
    </div>
  );

  return (
    <div>
      <h4 className="font-medium mb-2 flex items-center gap-2">
        Evolução do ROI por Torneio
      </h4>
      <ChartContainer config={{ roi: { color: "#d4af37", label: "ROI (%)" } }}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-10} dy={10} fontSize={11} />
          <YAxis
            label={{
              value: "ROI (%)",
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
              fill: "#666",
            }}
            domain={["auto", "auto"]}
            tickFormatter={v => v + "%"}
          />
          <Tooltip formatter={v => `${v}%`} />
          <Line
            type="monotone"
            dataKey="roi"
            stroke="#d4af37"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="ROI (%)"
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default RoiLineChart;
