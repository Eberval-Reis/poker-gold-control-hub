
import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, PieLabelRenderProps } from "recharts";

interface ExpenseCategoryData {
  category: string;
  amount: number;
}

interface ExpenseReportChartProps {
  data: ExpenseCategoryData[];
}

const COLORS = [
  "#d4af37", "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#0071C1"
];

function renderCustomizedLabel(props: PieLabelRenderProps & { category?: string }) {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, outerRadius, percent, index, category } = props;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#0088FE"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: 14, fontWeight: 500, pointerEvents: "none" }}
    >
      {category} ({(percent * 100).toFixed(0)}%)
    </text>
  );
}

const ExpenseReportChart: React.FC<ExpenseReportChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full" style={{ minHeight: 270 }}>
      <ResponsiveContainer width="100%" height={270}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={90}
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
              Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseReportChart;

