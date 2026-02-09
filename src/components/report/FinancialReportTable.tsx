
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

import { Performance, Expense } from '@/types';

interface FinancialReportTableProps {
  performances: Performance[];
  expenses: Expense[];
}

const FinancialReportTable: React.FC<FinancialReportTableProps> = ({
  performances,
  expenses,
}) => {
  // Helper para buscar despesas por torneio
  function getTournamentExpenses(tournamentId: string) {
    return expenses.filter((e) => e.tournament_id === tournamentId);
  }

  const rows = performances.map((perf, idx: number) => {
    const buyin = Number(perf.buyin_amount || 0);
    const rebuy = Number(perf.rebuy_amount || 0) * Number(perf.rebuy_quantity || 0);
    const prize = Number(perf.prize_amount || 0);
    const tournamentId = perf.tournament_id;
    const expenseArr = getTournamentExpenses(tournamentId);
    const expenseTotal = expenseArr.reduce((acc: number, e) => acc + Number(e.amount), 0);

    // Resultado: Premiação - (Buyin + Rebuy) - Despesas
    const resultado = prize - (buyin + rebuy) - expenseTotal;

    return {
      name: perf.tournaments?.name || `Torneio ${idx + 1}`,
      date: perf.tournaments?.date
        ? new Date(perf.tournaments.date).toLocaleDateString("pt-BR")
        : "-",
      buyin,
      rebuy,
      prize,
      expenseTotal,
      resultado,
    };
  });

  if (rows.length === 0) {
    return (
      <div className="text-muted-foreground text-center">
        Nenhum torneio no período selecionado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border mb-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Torneio</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Buy-in</TableHead>
            <TableHead>Rebuy</TableHead>
            <TableHead>Premiação</TableHead>
            <TableHead>Valor Despesas</TableHead>
            <TableHead>Resultado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>R$ {row.buyin.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>R$ {row.rebuy.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>R$ {row.prize.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
              <TableCell>R$ {row.expenseTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
              <TableCell className={
                row.resultado > 0
                  ? "text-green-700 font-semibold"
                  : row.resultado < 0
                    ? "text-red-700 font-semibold"
                    : ""
              }>
                R$ {row.resultado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FinancialReportTable;

