
import { z } from "zod";

export const tournamentPerformanceFormSchema = z.object({
  tournament_id: z.string({
    required_error: "Torneio é obrigatório",
  }),
  tournament_date: z.date({
    required_error: "Data do torneio é obrigatória",
  }),
  buyin_amount: z.string().min(1, "Valor do buy-in é obrigatório"),
  rebuy_amount: z.string().optional(),
  rebuy_quantity: z.string().optional(),
  addon_enabled: z.boolean().default(false),
  addon_amount: z.string().optional(),
  itm_achieved: z.boolean().default(false),
  final_table_achieved: z.boolean().default(false),
  position: z.string().optional(),
  prize_amount: z.string().optional(),
  ft_photo_url: z.string().optional(),
  news_link: z.string().optional(),
});

// Type for the form data
export type TournamentPerformanceFormData = z.infer<typeof tournamentPerformanceFormSchema>;

// Utility functions for calculations
export const calculateTotalInvested = (
  buyinAmount: number, 
  rebuyAmount?: number, 
  rebuyQuantity?: number,
  addonEnabled?: boolean,
  addonAmount?: number
): number => {
  const rebuyTotal = rebuyAmount && rebuyQuantity ? rebuyAmount * rebuyQuantity : 0;
  const addonTotal = addonEnabled && addonAmount ? addonAmount : 0;
  return buyinAmount + rebuyTotal + addonTotal;
};

export const calculateProfitLoss = (prizeAmount: number, totalInvested: number): number => {
  return prizeAmount - totalInvested;
};

export const calculateROI = (profitLoss: number, totalInvested: number): number => {
  if (totalInvested === 0) return 0;
  return (profitLoss / totalInvested) * 100;
};
