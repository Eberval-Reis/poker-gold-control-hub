
import { useQuery } from "@tanstack/react-query";
import { expenseService } from "@/services/expense.service";
import { tournamentPerformanceService } from "@/services/tournament-performance.service";

export type ReportType = "expenses" | "performance" | "financial" | "roi";
export type PeriodType = "week" | "month" | "quarter" | "year" | "custom";

export interface UseReportDataOptions {
  reportType: ReportType;
  period: PeriodType;
  startDate?: Date;
  endDate?: Date;
}

function getPeriodRange(period: PeriodType, startDate?: Date, endDate?: Date) {
  const now = new Date();
  let start: Date, end: Date;
  switch (period) {
    case "week":
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case "quarter": {
      const q = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), q * 3, 1);
      end = new Date(now.getFullYear(), q * 3 + 3, 0);
      break;
    }
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
      break;
    case "custom":
      start = startDate ?? now;
      end = endDate ?? now;
      break;
    default:
      start = startDate ?? now;
      end = endDate ?? now;
  }
  return { start, end };
}

export function useReportData({ reportType, period, startDate, endDate }: UseReportDataOptions) {
  // Data comum: despesas e performances
  const { start, end } = getPeriodRange(period, startDate, endDate);

  // Busca despesas
  const {
    data: expenses = [],
    isLoading: expensesLoading,
    error: expensesError,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: expenseService.getExpenses,
  });

  // Busca performances
  const {
    data: performances = [],
    isLoading: performancesLoading,
    error: performancesError,
  } = useQuery({
    queryKey: ["tournament-performances"],
    queryFn: tournamentPerformanceService.getTournamentPerformances,
  });

  // Filtro por período (para despesas e performances)
  const filteredExpenses = expenses.filter((exp: any) => {
    if (!exp.date) return false;
    const d = new Date(exp.date);
    return d >= start && d <= end;
  });

  const filteredPerformances = performances.filter((pf: any) => {
    if (!pf.created_at) return false;
    const d = new Date(pf.created_at);
    return d >= start && d <= end;
  });

  // Dados prontos para relatório de despesas
  const expenseCategories = Array.from(
    new Set(filteredExpenses.map((exp: any) => exp.type || "Outro"))
  );
  const expenseSumByCategory = expenseCategories.map((cat) => ({
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    amount: filteredExpenses
      .filter((exp: any) => (exp.type || "Outro") === cat)
      .reduce((sum, exp) => sum + Number(exp.amount), 0),
  }));

  return {
    loading: expensesLoading || performancesLoading,
    error: expensesError || performancesError,
    expenses: filteredExpenses,
    performances: filteredPerformances,
    expenseSumByCategory,
    start,
    end,
  };
}
