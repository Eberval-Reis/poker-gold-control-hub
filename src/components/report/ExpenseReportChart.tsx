
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

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

function renderCustomizedLabel(
  props: PieLabelRenderProps & { category?: string }
) {
  const RADIAN = Math.PI / 180;
  // Type narrowing: fallback to 0 if missing
  const cx =
    typeof props.cx === "number" ? props.cx : Number(props.cx) || 0;
  const cy =
    typeof props.cy === "number" ? props.cy : Number(props.cy) || 0;
  const outerRadius =
    typeof props.outerRadius === "number"
      ? props.outerRadius
      : Number(props.outerRadius) || 0;
  const { midAngle, percent, category } = props;

  // Mais afastado: +38
  const radius = outerRadius + 38;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Label max 15 chars visíveis, mostra resto no title
  const displayText =
    (category ? truncate(category, 15) : "") +
    ` (${(percent * 100).toFixed(0)}%)`;

  return (
    <text
      x={x}
      y={y}
      fill="#0088FE"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{
        fontSize: 12,
        fontWeight: 500,
        pointerEvents: "none", // impede selecionar
        filter: "drop-shadow(0 1px 2px #fff8)", // leve contorno para não sumir no fundo branco
        textShadow: "0 0 2px #fff8"
      }}
    >
      <title>
        {category} ({(percent * 100).toFixed(0)}%)
      </title>
      {displayText}
    </text>
  );
}

const ExpenseReportChart: React.FC<ExpenseReportChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ minHeight: 340 }}
    >
      <ResponsiveContainer width="100%" height={340}>
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

