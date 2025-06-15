
import React from "react";

interface Expense {
  id: string;
  type: string;
  amount: number;
  date: string;
  tournaments?: { name?: string };
}

interface ExpenseReportTableProps {
  expenses: Expense[];
}

// Memoização: só recria se props.expenses mudar (performance)
const ExpenseReportTable: React.FC<ExpenseReportTableProps> = React.memo(({ expenses }) => {
  if (expenses.length === 0) {
    return <div className="text-gray-500">Nenhuma despesa encontrada no período.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow border">
      <table className="w-full min-w-[440px] text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Data</th>
            <th className="px-4 py-2 text-left">Torneio</th>
            <th className="px-4 py-2 text-left">Categoria</th>
            <th className="px-4 py-2 text-right">Valor (R$)</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id} className="even:bg-gray-50">
              <td className="px-4 py-2">
                {exp.date
                  ? new Date(exp.date).toLocaleDateString("pt-BR")
                  : "-"}
              </td>
              <td className="px-4 py-2">{exp.tournaments?.name || "-"}</td>
              <td className="px-4 py-2">{exp.type}</td>
              <td className="px-4 py-2 text-right">{Number(exp.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

ExpenseReportTable.displayName = "ExpenseReportTable";
export default ExpenseReportTable;
