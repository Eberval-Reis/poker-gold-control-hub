import { useQuery } from "@tanstack/react-query";
import { expenseService } from "@/services/expense.service";
import { tournamentPerformanceService } from "@/services/tournament-performance.service";
import { useMemo } from "react";

export type ReportType = "expenses" | "performance" | "financial" | "roi" | "comparison";
export type PeriodType = "week" | "month" | "quarter" | "year" | "custom";

export interface UseReportDataOptions {
  reportType: ReportType;
  period: PeriodType;
  startDate?: Date;
  endDate?: Date;
}

const EXPENSE_CATEGORY_TRANSLATIONS: Record<string, string> = {
  transport: "Transporte",
  food: "Alimentação",
  accommodation: "Hospedagem",
  entry: "Inscrição",
  other: "Outros",
  outro: "Outros", // para compatibilidade, 'Outro' já transliterado
};

function translateExpenseCategory(cat: string) {
  const key = cat.toLowerCase();
  return EXPENSE_CATEGORY_TRANSLATIONS[key] || cat.charAt(0).toUpperCase() + cat.slice(1);
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

  // Memoização para performance!
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp: any) => {
      if (!exp.date) return false;
      const d = new Date(exp.date);
      return d >= start && d <= end;
    });
    // eslint-disable-next-line
  }, [expenses, start.getTime(), end.getTime()]);

  const filteredPerformances = useMemo(() => {
    return performances.filter((pf: any) => {
      if (!pf.created_at) return false;
      const d = new Date(pf.created_at);
      return d >= start && d <= end;
    });
    // eslint-disable-next-line
  }, [performances, start.getTime(), end.getTime()]);

  const expenseCategories = useMemo(() => Array.from(
    new Set(filteredExpenses.map((exp: any) => exp.type || "Outro"))
  ), [filteredExpenses]);

  const expenseSumByCategory = useMemo(() =>
    expenseCategories.map((cat) => ({
      category: translateExpenseCategory(cat),
      amount: filteredExpenses
        .filter((exp: any) => (exp.type || "Outro") === cat)
        .reduce((sum, exp) => sum + Number(exp.amount), 0),
    })),
    [expenseCategories, filteredExpenses]
  );

  const translatedExpenses = useMemo(() =>
    filteredExpenses.map((exp: any) => ({
      ...exp,
      type: translateExpenseCategory(exp.type || "Outro"),
    })), [filteredExpenses]
  );

  // Logs para debugar performance
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("useReportData", { reportType, period, start, end, expenseSumByCategory });
  }

  return {
    loading: expensesLoading || performancesLoading,
    error: expensesError || performancesError,
    expenses: translatedExpenses,
    performances: filteredPerformances,
    expenseSumByCategory,
    start,
    end,
  };
}
