import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { PeriodType } from "./useReportData";

export interface DREData {
  receita: number;
  cavalagem: number;
  totalBruto: number;
  despesas: number;
  totalLiquido: number;
  loading: boolean;
  error: any;
}

export interface UseDREReportDataOptions {
  period: PeriodType;
  startDate?: Date;
  endDate?: Date;
  eventId?: string;
  tournamentId?: string;
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

export function useDREReportData({ period, startDate, endDate, eventId, tournamentId }: UseDREReportDataOptions): DREData & { start: Date; end: Date } {
  const { start, end } = getPeriodRange(period, startDate, endDate);
  
  const startStr = start.toISOString().split("T")[0];
  const endStr = end.toISOString().split("T")[0];

  // Buscar performances (receitas/prêmios)
  const {
    data: performances = [],
    isLoading: perfLoading,
    error: perfError,
  } = useQuery({
    queryKey: ["dre-performances", startStr, endStr, eventId, tournamentId],
    queryFn: async () => {
      let query = supabase
        .from("tournament_performance")
        .select("*, tournaments(id, name, event_id)")
        .gte("tournament_date", startStr)
        .lte("tournament_date", endStr);

      if (tournamentId) {
        query = query.eq("tournament_id", tournamentId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filtrar por evento se especificado
      if (eventId && data) {
        return data.filter((p: any) => p.tournaments?.event_id === eventId);
      }

      return data || [];
    },
  });

  // Buscar despesas
  const {
    data: expenses = [],
    isLoading: expLoading,
    error: expError,
  } = useQuery({
    queryKey: ["dre-expenses", startStr, endStr, eventId, tournamentId],
    queryFn: async () => {
      let query = supabase
        .from("expenses")
        .select("*, tournaments(id, name, event_id)")
        .gte("date", startStr)
        .lte("date", endStr);

      if (tournamentId) {
        query = query.eq("tournament_id", tournamentId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filtrar por evento se especificado
      if (eventId && data) {
        return data.filter((e: any) => e.tournaments?.event_id === eventId);
      }

      return data || [];
    },
  });

  // Buscar cavalagem (investimentos recebidos de backers)
  const {
    data: backingInvestments = [],
    isLoading: backingLoading,
    error: backingError,
  } = useQuery({
    queryKey: ["dre-backing", startStr, endStr, eventId, tournamentId],
    queryFn: async () => {
      let query = supabase
        .from("backing_investments")
        .select("*, backing_offers(id, tournament_id, tournament_date, tournaments(id, name, event_id))")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

      const { data, error } = await query;
      if (error) throw error;

      let filtered = data || [];

      // Filtrar por torneio se especificado
      if (tournamentId) {
        filtered = filtered.filter((bi: any) => bi.backing_offers?.tournament_id === tournamentId);
      }

      // Filtrar por evento se especificado
      if (eventId) {
        filtered = filtered.filter((bi: any) => bi.backing_offers?.tournaments?.event_id === eventId);
      }

      return filtered;
    },
  });

  // Calcular totais
  const dreData = useMemo(() => {
    const receita = performances.reduce((sum: number, p: any) => sum + Number(p.prize_amount || 0), 0);
    const cavalagem = backingInvestments.reduce((sum: number, bi: any) => sum + Number(bi.amount_paid || 0), 0);
    const totalBruto = receita + cavalagem;
    const despesas = expenses.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
    const totalLiquido = totalBruto - despesas;

    return {
      receita,
      cavalagem,
      totalBruto,
      despesas,
      totalLiquido,
    };
  }, [performances, backingInvestments, expenses]);

  return {
    ...dreData,
    loading: perfLoading || expLoading || backingLoading,
    error: perfError || expError || backingError,
    start,
    end,
  };
}
