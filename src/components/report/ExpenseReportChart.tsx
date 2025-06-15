
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";

interface ExpenseCategoryData {
  category: string;
  amount: number;
}

interface ExpenseReportChartProps {
  data: ExpenseCategoryData[];
}

const COLORS = [
  "#d4af37",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A020F0",
  "#0071C1",
];

// Truncar SEM cortar a primeira letra e com mais caracteres visíveis
function truncateFull(str: string, max: number) {
  if (str.length <= max) return str;
  // Garante pelo menos 2 letras antes do "…"
  return str.slice(0, Math.max(2, max - 1)) + "…";
}

function renderCustomizedLabel(
  props: PieLabelRenderProps & { category?: string }
) {
  const RADIAN = Math.PI / 180;
  // Fallbacks de tipo seguro
  const cx = typeof props.cx === "number" ? props.cx : Number(props.cx) || 0;
  const cy = typeof props.cy === "number" ? props.cy : Number(props.cy) || 0;
  const outerRadius =
    typeof props.outerRadius === "number"
      ? props.outerRadius
      : Number(props.outerRadius) || 0;
  const { midAngle, percent, category } = props;

  // Mais afastado do gráfico
  const radius = outerRadius + 55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Aumenta o limite de caracteres mantendo o texto inicial 
  const textMaxChars = 20;
  const displayText =
    (category ? truncateFull(category, textMaxChars) : "") +
    ` (${(percent * 100).toFixed(0)}%)`;

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="#0088FE"
        textAnchor={x > cx ? "start" : "end"}
        alignmentBaseline="middle"
        style={{
          fontSize: 13,
          fontWeight: 500,
          pointerEvents: "none",
          filter: "drop-shadow(0 1px 2px #fff8)",
          textShadow: "0 0 2px #fff8",
          userSelect: "none",
        }}
      >
        <title>
          {category} ({(percent * 100).toFixed(0)}%)
        </title>
        {displayText}
      </text>
    </g>
  );
}

const ExpenseReportChart: React.FC<ExpenseReportChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-col items-center justify-center w-full px-2"
      style={{ minHeight: 360 }}
    >
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#d4af37"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) =>
              Number(value).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseReportChart;
