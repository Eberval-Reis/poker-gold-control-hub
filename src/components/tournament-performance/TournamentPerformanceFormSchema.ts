
import { z } from "zod";

export const tournamentPerformanceFormSchema = z.object({
  tournament_id: z.string({
    required_error: "Torneio é obrigatório",
  }),
  buyin_amount: z.string().min(1, "Valor do buy-in é obrigatório").transform(val => parseFloat(val)),
  rebuy_amount: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  rebuy_quantity: z.string().optional().transform(val => val ? parseInt(val) : 0),
  addon_enabled: z.boolean().default(false),
  addon_amount: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  itm_achieved: z.boolean().default(false),
  final_table_achieved: z.boolean().default(false),
  position: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  prize_amount: z.string().optional().transform(val => val ? parseFloat(val) : 0),
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
