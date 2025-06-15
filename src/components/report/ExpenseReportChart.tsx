
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
  "#d4af37", // Ouro - Inscrição
  "#0088FE", // Azul - Transporte
  "#00C49F", // Verde - Alimentação
  "#FFBB28", // Amarelo - Hospedagem
  "#FF8042", // Laranja - Outros
  "#A020F0", // Roxo
  "#0071C1", // Azul escuro
];

// Mostra o nome completo. Se estiver ultra longo (mais de 40 chars), trunca e deixa o tooltip.
function truncateLabel(str: string, max: number = 40) {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}

// Recebe idx para pegar cor
function renderCustomizedLabel(
  props: PieLabelRenderProps & { category?: string; idx?: number; colors?: string[] }
) {
  const RADIAN = Math.PI / 180;
  const cx = typeof props.cx === "number" ? props.cx : Number(props.cx) || 0;
  const cy = typeof props.cy === "number" ? props.cy : Number(props.cy) || 0;
  const outerRadius =
    typeof props.outerRadius === "number"
      ? props.outerRadius
      : Number(props.outerRadius) || 0;
  const { midAngle, percent, category, idx, colors } = props;

  const radius = outerRadius + 70; // mais longe para dar espaço
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const color = colors && typeof idx === "number"
    ? colors[idx % colors.length]
    : "#222";

  const showText = category ? truncateLabel(category) : "";
  const percentText = ` (${(percent * 100).toFixed(0)}%)`;

  return (
    <g>
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={x > cx ? "start" : "end"}
        alignmentBaseline="middle"
        style={{
          fontSize: 14,
          fontWeight: 600,
          pointerEvents: "auto",
          userSelect: "none",
          textShadow: "0 0 2px #fff8",
          filter: "drop-shadow(0 1px 2px #fff8)",
          whiteSpace: "pre",
        }}
      >
        <title>
          {category}
          {percentText}
        </title>
        {showText + percentText}
      </text>
    </g>
  );
}

const ExpenseReportChart: React.FC<ExpenseReportChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Envia idx e a paleta para cada label
  return (
    <div
      className="flex flex-col items-center justify-center w-full px-2"
      style={{ minHeight: 400 }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#d4af37"
            label={(props) =>
              renderCustomizedLabel({
                ...props,
                category: data[props.index]?.category,
                idx: props.index,
                colors: COLORS,
              })
            }
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
