
// Tipos específicos para o sistema de backing
export interface BackingOffer {
  id: string;
  tournament_id: string;
  player_name: string;
  buy_in_amount: number;
  tournament_date: string;
  collective_financing: boolean;
  available_percentage: number;
  markup_percentage: number;
  status: 'open' | 'closed' | 'finished';
  created_at?: string;
  updated_at?: string;
  // Join fields
  tournaments?: {
    id: string;
    name: string;
    clubs?: {
      name: string;
    };
  };
}

export interface BackingInvestment {
  id: string;
  backing_offer_id: string;
  backer_name: string;
  percentage_bought: number;
  amount_paid: number;
  payment_status: 'pending' | 'paid' | 'overdue';
  created_at?: string;
  updated_at?: string;
}

export interface BackingResult {
  id: string;
  backing_offer_id: string;
  result_type: 'busto' | 'itm' | 'final_table' | 'champion';
  prize_amount: number;
  net_prize: number;
  player_profit: number;
  created_at?: string;
  updated_at?: string;
}

export interface BackerPayout {
  id: string;
  backing_investment_id: string;
  backing_result_id: string;
  payout_amount: number;
  roi_percentage: number;
  payment_status: 'pending' | 'paid';
  created_at?: string;
  updated_at?: string;
}

// Tipos para cálculos
export interface BackingCalculation {
  totalInvested: number;
  totalPercentageSold: number;
  playerPercentage: number;
  prizeAmount: number;
  netPrize: number;
  playerProfit: number;
  backerPayouts: {
    backerId: string;
    backerName: string;
    investmentAmount: number;
    payout: number;
    roi: number;
  }[];
}
