
import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

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

const ExpenseReportChart: React.FC<ExpenseReportChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full" style={{ minHeight: 220 }}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#d4af37"
            label={({ category, percent }) =>
              `${category} (${(percent * 100).toFixed(0)}%)`
            }
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

