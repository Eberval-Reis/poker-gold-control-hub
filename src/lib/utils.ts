import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata uma data (string ou Date) para o padrão brasileiro DD/MM/AAAA.
 * Retorna "-" se a data for inválida ou não fornecida.
 */
export function formatDateToBR(date: string | Date | undefined | null): string {
  if (!date) return "-";
  let d: Date;
  if (typeof date === "string") {
    // Aceita "YYYY-MM-DD" ou outro formato parseável
    d = new Date(date);
    if (isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      // Corrige datas só com ano-mês-dia
      const [y, m, da] = date.split("-");
      d = new Date(Number(y), Number(m) - 1, Number(da));
    }
  } else {
    d = date;
  }
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}
