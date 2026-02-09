import { Database } from "@/integrations/supabase/types";

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Re-exporting basic types from Supabase for convenience
export type Tournament = Tables<'tournaments'> & {
    clubs?: { name: string } | null;
    event?: { name: string; date: string | null } | null;
};
export type Club = Tables<'Cadastro Clube'>;
export type Event = Tables<'schedule_events'>;
export type Expense = Tables<'expenses'> & {
    tournaments?: Tournament | null;
};
export type PokerPerformance = Tables<'tournament_performance'> & {
    tournaments?: (Partial<Tournament> & { clubs?: { name: string } | null }) | null;
    clubs?: { id: string; name: string } | null;
};

export type BackingOffer = Tables<'backing_offers'> & {
    tournaments?: (Partial<Tournament> & { schedule_events?: { name: string } | null }) | null;
    backing_investments?: BackingInvestment[] | null;
};

export type BackingInvestment = Tables<'backing_investments'> & {
    backing_offers?: BackingOffer | null;
};

export interface ExpenseCategory {
    category: string;
    total: number;
}

export interface ReportData {
    expenses: Expense[];
    performances: PokerPerformance[];
    expenseSumByCategory: { category: string; amount: number }[];
    totalExpenses?: number;
    totalPrizes?: number;
    profit?: number;
    start: Date;
    end: Date;
    loading?: boolean;
    error?: unknown;
}

export interface DREReportData {
    receita: number;
    cavalagem: number;
    receitaTotal: number;
    buyins: number;
    rebuys: number;
    addons: number;
    despesas: number;
    custoTotal: number;
    lucroLiquido: number;
}

// Tipo para tratamento de erros
export type ApiError = Error | { message: string };

// Tipo genérico para dados paginados
export interface PaginatedData<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
}

// Tipo para eventos PWA
export interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
